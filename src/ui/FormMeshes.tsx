import type { CSSProperties } from "react";
import type { Mesh } from "../math/types";

type Props = {
  items: Mesh[];
  onChange: (items: Mesh[]) => void;
  omegas: string[]; // para preencher selects
};

const ROW: CSSProperties = { display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.2fr 1.2fr auto", gap: 8, alignItems: "center" };
const HEAD: CSSProperties = { fontWeight: 600, opacity: 0.8 };
const BTN: CSSProperties = { padding: "6px 10px" };
const INPUT: CSSProperties = { padding: "6px 8px" };

export function FormMeshes({ items, onChange, omegas }: Props) {
  function update(i: number, patch: Partial<Mesh>) {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function add() {
    onChange([
      ...items,
      { i: omegas[0] ?? "", j: omegas[1] ?? "", carrier: omegas.find(o => o.startsWith("omega_b")) ?? "", type: "external" }
    ]);
  }
  function remove(i: number) {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <section>
      <h3>Meshes</h3>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={ROW}>
          <div style={HEAD}>i (ω)</div>
          <div style={HEAD}>j (ω)</div>
          <div style={HEAD}>carrier (ω)</div>
          <div style={HEAD}>engrenamento</div>
          <div />
        </div>

        {items.map((m, i) => (
          <div key={i} style={ROW}>
            <select style={INPUT} value={m.i} onChange={(e) => update(i, { i: e.target.value })}>
              {omegas.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={INPUT} value={m.j} onChange={(e) => update(i, { j: e.target.value })}>
              {omegas.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={INPUT} value={m.carrier} onChange={(e) => update(i, { carrier: e.target.value })}>
              {omegas.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select style={INPUT} value={m.type ?? "external"} onChange={(e) => update(i, { type: e.target.value as Mesh["type"] })}>
              <option value="external">external</option>
              <option value="internal">internal</option>
            </select>
            <button style={BTN} onClick={() => remove(i)}>Remover</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <button style={BTN} onClick={add}>Adicionar mesh</button>
      </div>
    </section>
  );
}
