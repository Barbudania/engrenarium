export interface Element {
  id: string;
  type: 'solar' | 'planet' | 'annulus' | 'arm';
  N?: number;          // número de dentes (não usado para 'arm')
  omega: string;       // nome da variável de velocidade (ex.: "omega_s1")
}

export interface Mesh {
  i: string;           // omega da engrenagem i
  j: string;           // omega da engrenagem j
  carrier: string;     // omega do braço (carrier) dessa malha
  type?: 'external' | 'internal'; // preferível
  sigma?: number;      // compatibilidade (se usar): +1 externo, -1 interno
}

export interface Constraint {
  type: 'known' | 'equal' | 'lock';
  var?: string;        // para known/lock
  a?: string;          // para equal
  b?: string;          // para equal
  value?: number;      // para known
}

export interface Ratio {
  id: string;
  num: string;
  den: string;
}

export interface Model {
  elements: Element[];
  carriers?: { id: string; omega: string }[];
  meshes: Mesh[];
  constraints?: Constraint[];
  ratios?: Ratio[];
}
