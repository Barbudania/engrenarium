import React from "react";
import type { Element } from "../math/types";

type Props = {
  items: Element[];
  onChange: (items: Element[]) => void;
};

const ROW: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr 1.5fr auto", gap: 8, alignItems: "center" };
const HEAD: React.CSSProperties = { fontWeight: 600, opacity: 0.8 };
const BTN: React.CSSProperties = { padding: "6px 10px" };
const INPUT: React.CSSProperties = { padding: "6px 8px" };

export function FormElements({ items, onChange }: Props) {
  function update(i: number, patch: Partial<Element>) {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function add() {
    const idx = items.length + 1;
    onChange([
      ...items,
      { id: `el${idx}`, type: "solar", N: 20, omega: suggestOmega("solar", items) },
    ]);
  }
  function remove(i: number) {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <section>
      <h3>Elements</h3>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={ROW}>
          <div style={HEAD}>Nome</div>
          <div style={HEAD}>Tipo</div>
          <div style={HEAD}>N (dentes)</div>
          <div style={HEAD}>ω-id</div>
          <div />
        </div>

        {items.map((el, i) => (
          <div key={i} style={ROW}>
            <input style={INPUT} value={el.id} onChange={(e) => update(i, { id: e.target.value })} />
            <select
              style={INPUT}
              value={el.type}
              onChange={(e) => {
                const type = e.target.value as Element["type"];
                update(i, { type, N: type === "arm" ? undefined : (el.N ?? 20) });
              }}
            >
              <option value="solar">solar</option>
              <option value="planet">planet</option>
              <option value="annulus">annulus</option>
              <option value="arm">arm</option>
            </select>
            <input
              style={INPUT}
              type="number"
              value={el.N ?? ""}
              onChange={(e) => update(i, { N: e.target.value === "" ? undefined : Number(e.target.value) })}
              disabled={el.type === "arm"}
            />
            <input style={INPUT} value={el.omega} onChange={(e) => update(i, { omega: e.target.value })} />
            <button style={BTN} onClick={() => remove(i)}>Remover</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <button style={BTN} onClick={add}>Adicionar elemento</button>
      </div>
    </section>
  );
}

function suggestOmega(type: Element["type"], all: Element[]) {
  const base = type === "solar" ? "omega_s" : type === "planet" ? "omega_p" : type === "annulus" ? "omega_a" : "omega_b";
  let k = 1;
  while (all.some(e => e.omega === `${base}${k}`)) k++;
  return `${base}${k}`;
}
