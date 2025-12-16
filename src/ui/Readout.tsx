import type { TopologyResult } from "../math/topology";

type Result = {
  variables: string[];
  velocities: Record<string, number>;
  ratios: { id: string; value: number }[];
};

export function Readout(props: { result: Result | null; topo: TopologyResult | null }) {
  const { result, topo } = props;
  if (!result) return <div style={{ opacity: 0.7 }}>Sem resultados ainda.</div>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section>
        <h3>Velocidades (rpm)</h3>
        <pre>
          {Object.entries(result.velocities)
            .map(([k, v]) => `  ${k}: ${fmt(v)}`)
            .join("\n")}
        </pre>
      </section>

      {!!result.ratios?.length && (
        <section>
          <h3>Relações</h3>
          <pre>
            {result.ratios.map((r) => `  ${r.id}: ${fmt(r.value)}`).join("\n")}
          </pre>
        </section>
      )}

      {topo && (
        <section>
          <h3>Topologia / Validação</h3>
          <p>
            <strong>Resumo:</strong> {msgResumo(topo.resumo)}
          </p>
          <details>
            <summary>Detalhes de caminhos</summary>
            <pre>
              {topo.caminhos
                .map(
                  (c) =>
                    `carrier=${c.carrier} | caminho=${c.caminho.join(" -> ")} | nPlanetas=${c.nPlanetas} | validacao=${c.validacao} | status=${c.status}`
                )
                .join("\n")}
            </pre>
          </details>
        </section>
      )}
    </div>
  );
}

function fmt(x: number) {
  return Number.isFinite(x) ? x.toFixed(6) : String(x);
}

function msgResumo(s: string) {
  switch (s) {
    case "braco-reto":
      return "Montável com braço reto.";
    case "braco-curvo":
      return "Montável; renderizar braço curvo.";
    case "impossivel-1planeta-modulo":
      return "Impossível fisicamente (1 planeta com módulo comum exige Na = Ns + 2·Np).";
    default:
      return s;
  }
}
