import type { ComponentProps, ReactNode } from "react";
import { Link } from "../../router/Link";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Markdown `## heading` gets an id, so sections can be linked to.
export function Heading({ children }: { children?: ReactNode }) {
  return <h2 id={typeof children === "string" ? slugify(children) : undefined}>{children}</h2>;
}

// Markdown links: in-site paths use the router, the rest open as usual.
export function ProseLink({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link className="link link--line" href={href} {...props} />;
  return <a className="link link--line" href={href} {...props} />;
}

type CalloutProps = { label: string; children: ReactNode };

export function Callout({ label, children }: CalloutProps) {
  return (
    <aside className="callout">
      <p className="callout__label">{label}</p>
      <div className="callout__body">{children}</div>
    </aside>
  );
}
