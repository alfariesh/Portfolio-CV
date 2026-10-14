import type { ReactNode } from "react";

type AiLoopProps = {
  /** The tool chain, left to right, e.g. ["Paper MCP", "Claude Code", "Vite+"]. */
  flow: string[];
  /** One row per step: what the agent did, and what stayed a human decision. */
  rows: [step: string, agent: string, me: string][];
  children?: ReactNode;
};

// The "ai in the loop" section every case study carries.
export function AiLoop({ flow, rows, children }: AiLoopProps) {
  return (
    <section className="ai-loop" aria-labelledby="ai-in-the-loop">
      <h2 id="ai-in-the-loop">ai in the loop</h2>
      {children}
      <Workflow steps={flow} />
      <div className="ai-loop__scroll">
        <table className="ai-loop__table">
          <thead>
            <tr>
              <th scope="col">step</th>
              <th scope="col">the agent</th>
              <th scope="col">me</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([step, agent, me]) => (
              <tr key={step}>
                <th scope="row">{step}</th>
                <td data-label="the agent">{agent}</td>
                <td data-label="me">{me}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Workflow({ steps }: { steps: string[] }) {
  return (
    <ol className="flow" aria-label="Workflow">
      {steps.map((step) => (
        <li key={step} className="flow__item">
          <span className="flow__step">
            <i aria-hidden="true" />
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
