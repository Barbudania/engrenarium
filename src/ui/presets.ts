export type ExampleId = "EX1" | "EX2" | "EX3" | "EX4";

export type UIStage = {
  id: number;
  solarZ: number | null;
  planetsZ: number[];
  annulusZ: number | null;
  lastSolarZ?: number;
  lastAnnulusZ?: number;
  planetCopies?: number;
};

export type UISpeed = { var?: string; value: number };
export type UIRatio = { entrada?: string; saida?: string };
export type UICoupling = { a?: string; b?: string };

type GearLabel = { pt: string; en: string };

export type PresetGear<TId extends string> = {
  id: TId;
  label: GearLabel;
  speeds: UISpeed[];
  couplings: UICoupling[];
  ratio: UIRatio;
};

type ExampleData<TId extends string> = {
  stages: UIStage[];
  gears: PresetGear<TId>[];
  order: TId[];
};

export type Ex1GearId = "e1" | "e2" | "e3" | "e4";
export type Ex2GearId = "f1" | "f2" | "fr";
export type Ex3GearId = "g1" | "g2" | "g3" | "g4" | "g5" | "gr";
export type Ex4GearId = "r1" | "r2" | "r3" | "r4" | "rr";

export type ExamplePresets = {
  EX1: ExampleData<Ex1GearId>;
  EX2: ExampleData<Ex2GearId>;
  EX3: ExampleData<Ex3GearId>;
  EX4: ExampleData<Ex4GearId>;
};

export const EXAMPLE_PRESETS: ExamplePresets = {
  EX1: {
    stages: [
      { id: 1, solarZ: 24, planetsZ: [12], annulusZ: 48, planetCopies: 3 },
    ],
    order: ["e1", "e2", "e3", "e4"],
    gears: [
      {
        id: "e1",
        label: { pt: "Relação 1", en: "Ratio 1" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a1", value: 10 },
        ],
        couplings: [],
        ratio: { entrada: "omega_s1", saida: "omega_b1" },
      },
      {
        id: "e2",
        label: { pt: "Relação 2", en: "Ratio 2" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_b1", value: 0 },
        ],
        couplings: [],
        ratio: { entrada: "omega_s1", saida: "omega_a1" },
      },
      {
        id: "e3",
        label: { pt: "Relação 3", en: "Ratio 3" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a1", value: 0 },
        ],
        couplings: [],
        ratio: { entrada: "omega_s1", saida: "omega_b1" },
      },
      {
        id: "e4",
        label: { pt: "Relação 4", en: "Ratio 4" },
        speeds: [
          { var: "omega_s1", value: 0 },
          { var: "omega_a1", value: 10 },
        ],
        couplings: [],
        ratio: { entrada: "omega_a1", saida: "omega_b1" },
      },
    ],
  },
  EX2: {
    stages: [
      { id: 1, solarZ: 27, planetsZ: [27], annulusZ: null, planetCopies: 3 },
      { id: 2, solarZ: 21, planetsZ: [33], annulusZ: null, planetCopies: 3 },
      { id: 3, solarZ: 30, planetsZ: [24], annulusZ: null, planetCopies: 3 },
    ],
    order: ["f1", "f2", "fr"],
    gears: [
      {
        id: "f1",
        label: { pt: "1ª marcha", en: "1st gear" },
        speeds: [
          { var: "omega_b1", value: 10 },
          { var: "omega_s2", value: 0 },
        ],
        couplings: [
          { a: "omega_p1_1", b: "omega_p2_1" },
          { a: "omega_p2_1", b: "omega_p3_1" },
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_b2", b: "omega_b3" },
        ],
        ratio: { entrada: "omega_b1", saida: "omega_s1" },
      },
      {
        id: "f2",
        label: { pt: "2ª marcha", en: "2nd gear" },
        speeds: [{ var: "omega_b1", value: 10 }],
        couplings: [
          { a: "omega_b1", b: "omega_s1" },
          { a: "omega_p1_1", b: "omega_p2_1" },
          { a: "omega_p2_1", b: "omega_p3_1" },
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_b2", b: "omega_b3" },
        ],
        ratio: { entrada: "omega_b1", saida: "omega_s1" },
      },
      {
        id: "fr",
        label: { pt: "Marcha ré", en: "Reverse gear" },
        speeds: [
          { var: "omega_b1", value: 10 },
          { var: "omega_s3", value: 0 },
        ],
        couplings: [
          { a: "omega_p1_1", b: "omega_p2_1" },
          { a: "omega_p2_1", b: "omega_p3_1" },
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_b2", b: "omega_b3" },
        ],
        ratio: { entrada: "omega_b1", saida: "omega_s1" },
      },
    ],
  },
  EX3: {
    stages: [
      { id: 1, solarZ: 61, planetsZ: [25], annulusZ: 111, planetCopies: 3 },
      { id: 2, solarZ: 57, planetsZ: [27], annulusZ: 111, planetCopies: 3 },
      { id: 3, solarZ: 49, planetsZ: [27], annulusZ: 103, planetCopies: 3 },
    ],
    order: ["g1", "g2", "g3", "g4", "g5", "gr"],
    gears: [
      {
        id: "g1",
        label: { pt: "1ª marcha", en: "1st gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a3", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
          { a: "omega_s1", b: "omega_s2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
      {
        id: "g2",
        label: { pt: "2ª marcha", en: "2nd gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a2", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
          { a: "omega_s1", b: "omega_s2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
      {
        id: "g3",
        label: { pt: "3ª marcha", en: "3rd gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a1", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
          { a: "omega_s1", b: "omega_s2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
      {
        id: "g4",
        label: { pt: "4ª marcha", en: "4th gear" },
        speeds: [{ var: "omega_s1", value: 10 }],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
          { a: "omega_s1", b: "omega_s2" },
          { a: "omega_s1", b: "omega_b2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
      {
        id: "g5",
        label: { pt: "5ª marcha", en: "5th gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a1", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
          { a: "omega_s1", b: "omega_b2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
      {
        id: "gr",
        label: { pt: "Marcha ré", en: "Reverse gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_a1", value: 0 },
          { var: "omega_a3", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_a2" },
          { a: "omega_b2", b: "omega_a3" },
          { a: "omega_s2", b: "omega_s3" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_b3" },
      },
    ],
  },
  EX4: {
    stages: [
      { id: 1, solarZ: 31, planetsZ: [24, 25], annulusZ: 88, planetCopies: 3 },
      { id: 2, solarZ: 38, planetsZ: [25], annulusZ: 88, planetCopies: 3 },
    ],
    order: ["r1", "r2", "r3", "r4", "rr"],
    gears: [
      {
        id: "r1",
        label: { pt: "1ª marcha", en: "1st gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_b1", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_p1_2", b: "omega_p2_1" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_a2" },
      },
      {
        id: "r2",
        label: { pt: "2ª marcha", en: "2nd gear" },
        speeds: [
          { var: "omega_s1", value: 10 },
          { var: "omega_s2", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_p1_2", b: "omega_p2_1" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_a2" },
      },
      {
        id: "r3",
        label: { pt: "3ª marcha", en: "3rd gear" },
        speeds: [{ var: "omega_s1", value: 10 }],
        couplings: [
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_p1_2", b: "omega_p2_1" },
          { a: "omega_s1", b: "omega_s2" },
        ],
        ratio: { entrada: "omega_s1", saida: "omega_a2" },
      },
      {
        id: "r4",
        label: { pt: "4ª marcha", en: "4th gear" },
        speeds: [
          { var: "omega_b1", value: 10 },
          { var: "omega_s2", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_p1_2", b: "omega_p2_1" },
        ],
        ratio: { entrada: "omega_b1", saida: "omega_a2" },
      },
      {
        id: "rr",
        label: { pt: "Marcha ré", en: "Reverse gear" },
        speeds: [
          { var: "omega_s2", value: 10 },
          { var: "omega_b1", value: 0 },
        ],
        couplings: [
          { a: "omega_b1", b: "omega_b2" },
          { a: "omega_p1_2", b: "omega_p2_1" },
        ],
        ratio: { entrada: "omega_s2", saida: "omega_a2" },
      },
    ],
  },
};
