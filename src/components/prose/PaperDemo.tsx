import { lazy, Suspense, useId, useState } from "react";

const PaperPlayground = lazy(() => import("./PaperPlayground"));

// Interactive demo for the paper-fibre note: drag the fibre amount, or turn the
// folds back on to see the lines they add.
export function PaperDemo() {
  const id = useId();
  const [amount, setAmount] = useState(0.35);
  const [lines, setLines] = useState(false);

  return (
    <figure className="demo">
      <div className="demo__stage">
        <Suspense fallback={null}>
          <PaperPlayground amount={amount} lines={lines} />
        </Suspense>
        <span className="demo__badge">live · webgl</span>
      </div>
      <figcaption className="demo__controls">
        <label className="demo__control" htmlFor={`${id}-amount`}>
          <span>fibre & roughness</span>
          <input
            id={`${id}-amount`}
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
          <output htmlFor={`${id}-amount`}>{amount.toFixed(2)}</output>
        </label>
        <label className="demo__control demo__control--check">
          <input
            type="checkbox"
            checked={lines}
            onChange={(event) => setLines(event.target.checked)}
          />
          <span>folds, wrinkles & crumples</span>
        </label>
      </figcaption>
    </figure>
  );
}
