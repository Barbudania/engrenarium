import type { Model } from './types';

// Convenções:
// - Conta o menor caminho (por carrier) entre qualquer SOLAR e qualquer ANNULUS.
// - Se caminho tem 1 planeta: checa Na == Ns + 2*Np.
// - Se caminho tem 2 planetas: se Na == Ns + 2*Np1 + 2*Np2 → preferir "braço-reto"; senão "braço-curvo".
// - Se falhar a igualdade no caso de 1 planeta → "impossivel-1planeta-modulo".

export type TopologyStatus = "braco-reto" | "braco-curvo" | "impossivel-1planeta-modulo";

export interface TopologyPathInfo {
  carrier: string;
  caminho: string[];    // sequência de omegas (ex.: ["omega_s","omega_p","omega_a"])
  nPlanetas: number;
  validacao: "ok" | "falha" | "ignorada";
  status: TopologyStatus;
  Ns: number | null;
  Nps: (number | null)[];
  Na: number | null;
}

export interface TopologyResult {
  resumo: TopologyStatus;
  caminhos: TopologyPathInfo[];
}

// --- Tipos simples para retorno
export type MontagemTipo = "reto" | "curvo" | "aberta" | "impossivel";
export type MontagemStatus = { tipo: MontagemTipo; valido: boolean; mensagem: string; mensagem_en?: string;
};

/**
 * Valida a montabilidade de UM estágio planetário.
 * Regras:
 *  - 1 planeta (Solar–P1–Anelar):        Na DEVE ser Ns + 2*Np   (senão IMPOSSÍVEL)
 *  - 2 planetas (Solar–P1–P2–Anelar):    Na DEVE ser <= Ns + 2*(Np1+Np2)
 *      • Na == limite → braço RETO
 *      • Na <  limite → braço CURVO
 *  - Sem anelar: retorna "aberta" (válida)
 *  - 3+ planetas: generalização Na <= Ns + 2*∑Np  (<= → curvo, == → reto)
 */
export function validarMontagem(
  Ns: number | null | undefined,          // dentes do solar
  Np: number[],        // dentes dos planetas (na ordem da cadeia)
  Na?: number | null,   // dentes do anelar (se houver)
  planetCopies: number = 1, // nº de planetas em órbita (cópias visuais)
): MontagemStatus {

  if ((Ns != null) && (Na != null) && Np.length === 0) {
    return {
      tipo: "impossivel",
      valido: false,
      mensagem: "Montagem impossível: é necessário pelo menos uma engrenagem planeta entre engrenagens Solar e Anelar.", mensagem_en: "Impossible assembly: at least one planet gera is required between Sun and Ring gears."
    };
  }

  if (Na == null) {
    return { tipo: "aberta", valido: true, mensagem: "Sem engrenagem anelar (estágio aberto).",mensagem_en: "No ring gear (open stage)." };
  }

  // Sem solar: aplica geometria de círculos inscritos vs. anel (depende de quantas cópias/orbitas existem)
  if (Ns == null) {
    const copies = Math.max(1, Math.round(planetCopies || 1));
    const NaAbs = Math.abs(Na);

    if (Np.length >= 1) {
      const Zc = Math.abs(Np[Np.length - 1]); // planeta em contato com o anel

      if (copies <= 1) {
        // Caso simples: apenas exige anelar maior que o planeta de contato
        if (NaAbs <= Zc) {
          return {
            tipo: "impossivel",
            valido: false,
            mensagem: `Montagem impossível: anelar (${Na}) deve ser maior que o planeta de contato (${Zc}).`,
            mensagem_en: `Impossible assembly: ring (${Na}) must be larger than the contact planet (${Zc}).`,
          };
        }
      } else {
        // Cópias orbitando: raio mínimo = r*(1 + 1/sin(pi/n)) → aplica fator aos dentes
        const s = Math.sin(Math.PI / copies);
        const minNa = (!Number.isFinite(s) || s <= 1e-6) ? Infinity : Math.ceil(Zc * (1 + 1 / s));
        if (NaAbs < minNa) {
          return {
            tipo: "impossivel",
            valido: false,
            mensagem: `Montagem impossível: para ${copies} planetas em órbita, o anelar precisa de pelo menos ${minNa} dentes (atual: ${Na}).`,
            mensagem_en: `Impossible assembly: with ${copies} orbiting planets, the ring needs at least ${minNa} teeth (current: ${Na}).`,
          };
        }
      }
    }

    return { tipo: "aberta", valido: true, mensagem: "Sem solar (estágio aberto para acoplamentos).", mensagem_en: "No sun gear (stage open for couplings)." };
  }

  // 1 planeta → igualdade estrita
  if (Np.length === 1) {
    const esperado = Ns + 2 * Np[0];
    if (Na !== esperado) {
      return {
        tipo: "impossivel",
        valido: false,
        mensagem: `Montagem impossível: para 1 planeta, é obrigatório Na = Ns + 2×Np = ${esperado}.`, mensagem_en: `Impossible assembly: for 1 planet, it's mandatory Na = Ns + 2×Np = ${esperado}.`
      };
    }
    return {
      tipo: "reto",
      valido: true,
      mensagem: `Braço reto: Na = Ns + 2×Np = ${esperado}.`, mensagem_en: `Straight carrier: Na = Ns + 2×Np = ${esperado}.`
    };
  }

// 2 planetas → Na <= Ns + 2*(Np1+Np2)
if (Np.length === 2) {
  const max = Ns + 2 * (Np[0] + Np[1]);

  if (Na > max) {
    return {
      tipo: "impossivel",
      valido: false,
      mensagem: `Montagem impossível: Na = ${Na} maior que o limite Ns + 2×(Np1+Np2) = ${max}.`,
      mensagem_en: `Assembly impossible: Na = ${Na} exceeds the limit Ns + 2×(Np1+Np2) = ${max}.`,
    };
  }

  const tipo: MontagemTipo = Na === max ? "reto" : "curvo";

  // sem prefixo “Braço …” (o UI já renderiza o prefixo traduzido)
  const msgPt =
    tipo === "reto"
      ? `Na = ${Na} (atinge o limite Ns + 2×(Np1+Np2) = ${max}).`
      : `Na = ${Na} (abaixo do limite Ns + 2×(Np1+Np2) = ${max}).`;

  const msgEn =
    tipo === "reto"
      ? `Na = ${Na} (meets the limit Ns + 2×(Np1+Np2) = ${max}).`
      : `Na = ${Na} (below the limit Ns + 2×(Np1+Np2) = ${max}).`;

  return { tipo, valido: true, mensagem: msgPt, mensagem_en: msgEn };
}


  // 3 ou mais planetas → generalização Na <= Ns + 2*∑Np
  const max = Ns + 2 * Np.reduce((a, b) => a + b, 0);
  if (Na > max) {
    return {
      tipo: "impossivel",
      valido: false,
      mensagem: `Montagem impossível: Na = ${Na} maior que o limite Ns + 2×∑Np = ${max}.`, mensagem_en: `Impossible assembly: Na = ${Na} exceeds the limit Ns + 2×∑Np = ${max}.`
    };
  }
  const tipo: MontagemTipo = (Na === max ? "reto" : "curvo");
  return {
    tipo,
    valido: true,
    mensagem: `Braço ${tipo}: Na = ${Na}, limite Ns + 2×∑Np = ${max}.`, mensagem_en: `Carrier ${tipo}: Na = ${Na}, limit Ns + 2×∑Np = ${max}.`
  };
}


export function analisarTopologia(model: Model): TopologyResult {
  const elByOmega: Record<string, any> = {};
  for (const e of model.elements) elByOmega[e.omega] = e;

  // Agrupar malhas por carrier
  const meshesByCarrier = new Map<string, { i: string; j: string; carrier: string }[]>();
  for (const m of model.meshes) {
    const c = m.carrier;
    if (!meshesByCarrier.has(c)) meshesByCarrier.set(c, []);
    meshesByCarrier.get(c)!.push(m as any);
  }

  const suns = model.elements.filter((e) => e.type === "solar").map((e) => e.omega);
  const ann  = model.elements.filter((e) => e.type === "annulus").map((e) => e.omega);

  const detalhes: TopologyPathInfo[] = [];
  let anyImpossivel = false;
  let anyReto = false;

  for (const [carrier, meshes] of meshesByCarrier.entries()) {
    // Grafo não dirigido: omega -> adjacentes
    const G = new Map<string, Set<string>>();
    const addE = (u: string, v: string) => {
      if (!G.has(u)) G.set(u, new Set());
      G.get(u)!.add(v);
    };
    for (const m of meshes) { addE(m.i, m.j); addE(m.j, m.i); }

    for (const s of suns) {
      if (!G.has(s)) continue;
      for (const a of ann) {
        if (!G.has(a)) continue;

        const path = bfsPath(G, s, a);
        if (!path) continue;

        const internos = path.slice(1, -1);
        const planetas = internos.filter((w) => elByOmega[w]?.type === "planet");
        const nPlanetas = planetas.length;

        let validacao: "ok" | "falha" | "ignorada" = "ignorada";
        let status: TopologyStatus = "braco-curvo";

        if (nPlanetas === 1) {
          const eS = elByOmega[path[0]];
          const eP = elByOmega[planetas[0]];
          const eA = elByOmega[path[path.length - 1]];
          if (isNum(eS?.N) && isNum(eP?.N) && isNum(eA?.N)) {
            const ok = eA.N === eS.N + 2 * eP.N;
            validacao = ok ? "ok" : "falha";
            status = ok ? "braco-reto" : "impossivel-1planeta-modulo";
          }
        } else if (nPlanetas === 2) {
          const eS  = elByOmega[path[0]];
          const eP1 = elByOmega[planetas[0]];
          const eP2 = elByOmega[planetas[1]];
          const eA  = elByOmega[path[path.length - 1]];
          if (isNum(eS?.N) && isNum(eP1?.N) && isNum(eP2?.N) && isNum(eA?.N)) {
            const ok = eA.N === eS.N + 2 * eP1.N + 2 * eP2.N;
            validacao = ok ? "ok" : "ignorada";
            status = ok ? "braco-reto" : "braco-curvo";
          }
        } else {
          validacao = "ignorada";
          status = "braco-curvo";
        }

        if (status === "impossivel-1planeta-modulo") anyImpossivel = true;
        if (status === "braco-reto") anyReto = true;

        detalhes.push({
          carrier,
          caminho: path,
          nPlanetas,
          validacao,
          status,
          Ns: elByOmega[path[0]]?.N ?? null,
          Nps: planetas.map((w) => elByOmega[w]?.N ?? null),
          Na: elByOmega[path[path.length - 1]]?.N ?? null
        });
      }
    }
  }

  const resumo: TopologyStatus = anyImpossivel
    ? "impossivel-1planeta-modulo"
    : anyReto
    ? "braco-reto"
    : "braco-curvo";

  return { resumo, caminhos: detalhes };
}

function bfsPath(G: Map<string, Set<string>>, src: string, dst: string): string[] | null {
  const q: string[] = [src];
  const prev = new Map<string, string | null>([[src, null]]);
  while (q.length) {
    const u = q.shift()!;
    if (u === dst) break;
    for (const v of G.get(u) || []) {
      if (!prev.has(v)) {
        prev.set(v, u);
        q.push(v);
      }
    }
  }
  if (!prev.has(dst)) return null;
  const path: string[] = [];
  for (let v: string | null = dst; v !== null; v = prev.get(v)! ) path.push(v);
  return path.reverse();
}
function isNum(x: any): x is number { return typeof x === "number" && isFinite(x); }
