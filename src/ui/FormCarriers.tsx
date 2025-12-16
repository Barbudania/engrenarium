import React from "react";

type Carrier = { id: string; omega: string };

type Props = {
  items: Carrier[];
  onChange: (items: Carrier[]) => void;
};

const ROW: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.5fr 1.5fr auto", gap: 8, alignItems: "center" };
const HEAD: React.CSSProperties = { fontWeight: 600, opacity: 0.8 };
const BTN: React.CSSProperties = { padding: "6px 10px" };
const INPUT: React.CSSProperties = { padding: "6px 8px" };

export function FormCarriers({ items, onChange }: Props) {
  function update(i: number, patch: Partial<Carrier>) {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function add() {
    const idx = items.length + 1;
    onChange([...items, { id: `arm${idx}`, omega: `omega_b${idx}` }]);
  }
  function remove(i: number) {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <section>
      <h3>Carriers</h3>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={ROW}>
          <div style={HEAD}>Nome</div>
          <div style={HEAD}>ω-id</div>
          <div />
        </div>

        {items.map((c, i) => (
          <div key={i} style={ROW}>
            <input style={INPUT} value={c.id} onChange={(e) => update(i, { id: e.target.value })} />
            <input style={INPUT} value={c.omega} onChange={(e) => update(i, { omega: e.target.value })} />
            <button style={BTN} onClick={() => remove(i)}>Remover</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <button style={BTN} onClick={add}>Adicionar carrier</button>
      </div>
    </section>
  );
}
