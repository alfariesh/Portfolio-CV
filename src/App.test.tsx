import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import App from "./App";
import { caseStudies } from "./case-studies";
import { footer, nav } from "./content";
import { notes, tags } from "./notes";
import { matchRoute } from "./router/routes";

const render = (url: string) => renderToString(<App url={url} />);

const pages = [
  "/",
  "/work",
  "/notes",
  ...caseStudies.map((study) => `/work/${study.slug}`),
  ...notes.map((note) => `/notes/${note.slug}`),
];

// Every in-site link must land on a page that exists.
function resolves(href: string) {
  const { pathname } = new URL(href, "https://example.com");
  const route = matchRoute(pathname);
  if (route.name === "work") return caseStudies.some((study) => study.slug === route.slug);
  if (route.name === "note") return notes.some((note) => note.slug === route.slug);
  return route.name !== "missing";
}

describe("home page", () => {
  const html = render("/");

  it("renders the hero headline as the only h1", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain("design, then ship it");
  });

  it("has a section for every nav link that points at it", () => {
    for (const item of nav) {
      if (item.href.startsWith("/#")) expect(html).toContain(`id="${item.href.slice(2)}"`);
    }
  });

  it("only links to home anchors that exist", () => {
    const anchors = [...html.matchAll(/href="\/?#([^"]+)"/g)].map((m) => m[1]);
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

  it("links the work and notes indexes", () => {
    expect(html).toContain(`href="/work"`);
    expect(html).toContain(`href="/notes"`);
  });
});

describe.each(pages)("page %s", (url) => {
  const html = render(url);

  it("has exactly one h1", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it("only links to pages that exist", () => {
    const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
    for (const href of new Set(hrefs)) expect(resolves(href), href).toBe(true);
  });

  it("only links to sections that exist on other pages", () => {
    const hrefs = [...html.matchAll(/href="(\/[^"#]+)#([^"]+)"/g)];
    for (const [, page, id] of hrefs) {
      expect(render(page), `${page}#${id}`).toContain(`id="${id}"`);
    }
  });
});

describe("case studies", () => {
  it.each(caseStudies.map((study) => [study.slug]))("%s has an ai in the loop section", (slug) => {
    const html = render(`/work/${slug}`);
    expect(html).toContain('id="ai-in-the-loop"');
    expect(html).toContain('class="ai-loop__table"');
  });

  it("are all listed on /work, in a unique order", () => {
    const html = render("/work");
    for (const study of caseStudies) expect(html).toContain(`href="/work/${study.slug}"`);
    expect(new Set(caseStudies.map((study) => study.order)).size).toBe(caseStudies.length);
  });
});

describe("notes", () => {
  it("have a date, a known tag and a summary", () => {
    for (const note of notes) {
      expect(note.date, note.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(tags, note.slug).toContain(note.tag);
      expect(note.summary.length, note.slug).toBeGreaterThan(0);
    }
  });

  it("are sorted newest first", () => {
    const dates = notes.map((note) => note.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
});

describe("routes", () => {
  it("renders a not-found page for unknown paths and slugs", () => {
    for (const url of ["/nope", "/work/nope", "/notes/nope", "/notes/a/b"]) {
      expect(render(url)).toContain("a blank sheet");
    }
  });
});

describe("content", () => {
  it("keeps footer columns non-empty", () => {
    for (const col of footer.columns) {
      expect(col.links.length).toBeGreaterThan(0);
    }
  });
});
