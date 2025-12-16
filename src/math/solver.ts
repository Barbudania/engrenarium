import type { Model } from './types';
import { leastSquares } from '../lib/numeric';

export function solveGearSystem(model: Model) {
  const vars = new Set<string>();
  for (const el of model.elements) vars.add(el.omega);
  for (const c of model.carriers || []) vars.add(c.omega);
  for (const cx of model.constraints || []) {
    if (cx.var) vars.add(cx.var);
    if (cx.a) vars.add(cx.a);
    if (cx.b) vars.add(cx.b);
  }

  const vlist = Array.from(vars);
  const vidx = Object.fromEntries(vlist.map((v, i) => [v, i]));
  const n = vlist.length;
  const rows: { A: number[]; b: number; tag: string }[] = [];

  // malhas
  for (const m of model.meshes) {
    const { i, j, carrier } = m;
    const sigma =
      'type' in m ? (m.type === 'external' ? +1 : -1) : (m.sigma ?? 1);
    const Ni = lookupN(model, i);
    const Nj = lookupN(model, j);
    const row = new Array(n).fill(0);
    row[vidx[i]] += Ni;
    row[vidx[carrier]] += -Ni;
    row[vidx[j]] += sigma * Nj;
    row[vidx[carrier]] += -sigma * Nj;
    rows.push({ A: row, b: 0, tag: `mesh(${i},${j}|b=${carrier})` });
  }

  // restrições
  for (const c of model.constraints || []) {
    if (c.type === 'known') {
      const row = new Array(n).fill(0);
      row[vidx[c.var!]] = 1;
      rows.push({ A: row, b: c.value ?? 0, tag: `known(${c.var})` });
    } else if (c.type === 'equal') {
      const row = new Array(n).fill(0);
      row[vidx[c.a!]] = 1;
      row[vidx[c.b!]] -= 1;
      rows.push({ A: row, b: 0, tag: `equal(${c.a}=${c.b})` });
    } else if (c.type === 'lock') {
      const row = new Array(n).fill(0);
      row[vidx[c.var!]] = 1;
      rows.push({ A: row, b: 0, tag: `lock(${c.var})` });
    }
  }

  const { A, b } = stack(rows);
  // --- DETECÇÃO DE SUBDETERMINAÇÃO ---
function rankOf(M: number[][]): number {
  const eps = 1e-9;
  const A = M.map(r => [...r]);
  let r = 0, c = 0;
  const n = A.length, m = A[0]?.length ?? 0;
  while (r < n && c < m) {
    // encontra pivô
    let pivot = r;
    for (let i = r + 1; i < n; i++) {
      if (Math.abs(A[i][c]) > Math.abs(A[pivot][c])) pivot = i;
    }
    if (Math.abs(A[pivot][c]) < eps) { c++; continue; }
    [A[r], A[pivot]] = [A[pivot], A[r]];
    const div = A[r][c];
    for (let j = c; j < m; j++) A[r][j] /= div;
    for (let i = 0; i < n; i++) {
      if (i !== r) {
        const f = A[i][c];
        for (let j = c; j < m; j++) A[i][j] -= f * A[r][j];
      }
    }
    r++; c++;
  }
  return r;
}

const rank = rankOf(A);
const nVars = A[0].length;
const missingConstraints = Math.max(0, nVars - rank);

// rank da matriz aumentada [A|b] para detectar inconsistência (superdeterminação)
const Ab = A.map((row, i) => [...row, b[i]]);
const rankAug = rankOf(Ab);

if (rankAug > rank) {
  // Sistema SUPERDETERMINADO (inconsistente)
  // Quantidade mínima de restrições a remover para restabelecer consistência:
  // - diferença de postos (rankAug - rank) garante voltar a ter solução
  // - rows.length - nVars é um teto prático de “excesso” de equações
  const extraEq = rows.length - nVars;
  const conflictingConstraints = Math.max(1, rankAug - rank, extraEq);
  return {
    velocities: {},
    ratios: [],
    isOverdetermined: true,
    conflictingConstraints,
    missingConstraints: 0,
  };
}

if (rank < nVars) {
  // Sistema SUBDETERMINADO
  return {
    velocities: {},
    undetermined: vlist.slice(),
    ratios: [],
    isUnderdetermined: true,
    missingConstraints,
  };
}

  const sol = leastSquares(A, b);
  const velocities = Object.fromEntries(vlist.map((v, i) => [v, sol[i]]));

  
  const ratios = [];
  for (const r of model.ratios || []) {
    const num = velocities[r.num];
    const den = velocities[r.den];
    ratios.push({ id: r.id, value: Math.abs(den) < 1e-12 ? NaN : num / den });
  }

  return { variables: vlist, velocities, ratios, debug: { rows } };
}

function lookupN(model: Model, omegaId: string) {
  const e = model.elements.find((e) => e.omega === omegaId);
  if (!e) throw new Error(`Elemento não encontrado para ${omegaId}`);
  if (typeof e.N !== 'number') throw new Error(`Elemento ${omegaId} sem N`);
  return e.N;
}

function stack(rows: { A: number[]; b: number }[]) {
  const m = rows.length;
  const A = Array.from({ length: m }, (_, r) => rows[r].A.slice());
  const b = rows.map((r) => r.b);
  return { A, b };
}
