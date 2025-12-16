import React from "react";
import type { Constraint } from "../math/types";

type Props = {
  items: Constraint[];
  onChange: (items: Constraint[]) => void;
  omegas: string[];
};

const ROW: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.1fr 1.3fr 1.3fr 1.1fr auto", gap: 8, alignItems: "center" };
const HEAD: React.CSSProperties = { fontWeight: 600, opacity: 0.8 };
const BTN: React.CSSProperties = { padding: "6px 10px" };
const INPUT: React.CSSProperties = { padding: "6px 8px" };

export function FormConstraints({ items, onChange, omegas }: Props) {
  function update(i: number, patch: Partial<Constraint>) {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function addKnown() {
    onChange([...items, { type: "known", var: omegas[0] ?? "", value: 0 }]);
  }
  function addEqual() {
    onChange([...items, { type: "equal", a: omegas[0] ?? "", b: omegas[1] ?? "" }]);
  }
  function remove(i: number) {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <section>
      <h3>Constraints</h3>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={ROW}>
          <div style={HEAD}>tipo</div>
          <div style={HEAD}>var / a (ω)</div>
          <div style={HEAD}>valor / b (ω)</div>
          <div style={HEAD}>nota</div>
          <div />
        </div>

        {items.map((c, i) => (
          <div key={i} style={ROW}>
            <select
              style={INPUT}
              value={c.type}
              onChange={(e) => {
                const type = e.target.value as Constraint["type"];
                if (type === "known") update(i, { type, b: undefined, a: undefined, var: omegas[0] ?? "", value: 0 });
                else if (type === "equal") update(i, { type, var: undefined, value: undefined, a: omegas[0] ?? "", b: omegas[1] ?? "" });
                else update(i, { type, var: omegas[0] ?? "", value: 0 });
              }}
            >
              <option value="known">known (ω = valor)</option>
              <option value="equal">equal (ωa = ωb)</option>
              <option value="lock">lock (ω = 0)</option>
            </select>

            {c.type === "equal" ? (
              <>
                <select style={INPUT} value={c.a ?? ""} onChange={(e) => update(i, { a: e.target.value })}>
                  {omegas.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select style={INPUT} value={c.b ?? ""} onChange={(e) => update(i, { b: e.target.value })}>
                  {omegas.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div style={{ opacity: 0.6 }}>ωa = ωb</div>
              </>
            ) : (
              <>
                <select style={INPUT} value={c.var ?? ""} onChange={(e) => update(i, { var: e.target.value })}>
                  {omegas.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <input
                  style={INPUT}
                  type="number"
                  value={Number(c.value ?? 0)}
                  onChange={(e) => update(i, { value: Number(e.target.value) })}
                  disabled={c.type === "lock"}
                />
                <div style={{ opacity: 0.6 }}>{c.type === "lock" ? "fixa ω=0" : "rpm"}</div>
              </>
            )}
            <button style={BTN} onClick={() => remove(i)}>Remover</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button style={BTN} onClick={addKnown}>+ known</button>
        <button style={BTN} onClick={addEqual}>+ equal</button>
      </div>
    </section>
  );
}
