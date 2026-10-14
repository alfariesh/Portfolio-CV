import type { ReactNode } from "react";

type CellProps = {
  span?: 1 | 2;
  tone?: "paper" | "clear";
  className?: string;
  id?: string;
  children?: ReactNode;
};

export function Cell({ span = 2, tone = "paper", className, id, children }: CellProps) {
  const classes = ["cell", `cell--span${span}`, `cell--${tone}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} id={id}>
      {children}
    </div>
  );
}

// Large circle with slowly orbiting dashed arcs, cropped by its cell.
export function Orbit({ anchor }: { anchor: "top" | "bottom" }) {
  return (
    <div className="orbit-clip" aria-hidden="true">
      <svg className={`orbit orbit--${anchor}`} viewBox="0 0 1080 1080">
        <circle cx="540" cy="540" r="539" className="orbit__disc" />
        <g className="orbit__arcs">
          <circle
            cx="540"
            cy="540"
            r="539"
            strokeDasharray="250 3138"
            className="orbit__arc orbit__arc--1"
          />
          <circle
            cx="540"
            cy="540"
            r="539"
            strokeDasharray="170 3218"
            strokeDashoffset="-80"
            className="orbit__arc orbit__arc--2"
          />
          <circle
            cx="540"
            cy="540"
            r="539"
            strokeDasharray="90 3298"
            strokeDashoffset="-160"
            className="orbit__arc orbit__arc--3"
          />
          <circle
            cx="540"
            cy="540"
            r="539"
            strokeDasharray="35 3353"
            strokeDashoffset="-215"
            className="orbit__arc orbit__arc--4"
          />
        </g>
      </svg>
    </div>
  );
}

type HeadProps = {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  align?: "start" | "center";
  children?: ReactNode;
};

export function Head({ id, eyebrow, title, body, align = "start", children }: HeadProps) {
  return (
    <div className={`head head--${align}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title" id={id}>
        {title}
      </h2>
      <p className="head__body">{body}</p>
      {children}
    </div>
  );
}

export function Blurb({ title, body }: { title: string; body: string }) {
  return (
    <div className="blurb">
      <h3 className="blurb__title">{title}</h3>
      <p className="blurb__body">{body}</p>
    </div>
  );
}
