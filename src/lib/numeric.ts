export function transpose(M: number[][]): number[][] {
  return M[0].map((_, j) => M.map((row) => row[j]));
}

export function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length,
    k = A[0].length,
    n = B[0].length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let t = 0; t < k; t++)
      if (A[i][t] !== 0)
        for (let j = 0; j < n; j++) C[i][j] += A[i][t] * B[t][j];
  return C;
}

export function matVec(A: number[][], x: number[]): number[] {
  return A.map((row) => row.reduce((s, ai, i) => s + ai * x[i], 0));
}

export function solveGaussian(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => row.concat([b[i]]));
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++)
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-15) continue;
    if (piv !== c) [M[c], M[piv]] = [M[piv], M[c]];
    const div = M[c][c];
    for (let j = c; j <= n; j++) M[c][j] /= div;
    for (let r = 0; r < n; r++)
      if (r !== c) {
        const f = M[r][c];
        if (f !== 0) for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j];
      }
  }
  return M.map((row) => row[n]);
}

export function leastSquares(A: number[][], b: number[]): number[] {
  const AT = transpose(A);
  const ATA = matMul(AT, A);
  const ATb = matVec(AT, b);
  return solveGaussian(ATA, ATb);
}
