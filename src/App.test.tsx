import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import App from "./App";
import { footer, nav, projects } from "./content";

describe("portfolio page", () => {
  const html = renderToString(<App />);

  it("renders the hero headline as the only h1", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("design, then ship it");
  });

  it("has a section for every nav link", () => {
    for (const item of nav) {
      expect(html).toContain(`id="${item.href.slice(1)}"`);
    }
  });

  it("only links to in-page anchors that exist", () => {
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    for (const id of new Set(anchors)) {
      expect(html, `missing #${id}`).toContain(`id="${id}"`);
    }
  });

  it("gives every illustration an accessible label", () => {
    const images = html.match(/role="img"/g) ?? [];
    const labelled = html.match(/role="img" aria-label="[^"]+"/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    expect(labelled).toHaveLength(images.length);
  });
});

describe("content", () => {
  it("uses unique project slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps footer columns non-empty", () => {
    for (const col of footer.columns) {
      expect(col.links.length).toBeGreaterThan(0);
    }
  });
});
