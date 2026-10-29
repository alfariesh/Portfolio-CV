import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import App from "./App";
import { caseStudies } from "./case-studies";
import { footer, nav } from "./content";
import { feed } from "./feed";
import { notes, tags } from "./notes";
import { preloadPage } from "./preload";
import { isFile, matchRoute } from "./router/routes";
import { absolute, notesFeed, ogImage, pages as seoPages, site } from "./seo";

const render = (url: string) => renderToString(<App url={url} />);

const pages = seoPages.map((page) => page.path);

// Figures and bodies are lazy chunks; load every page's before rendering.
await Promise.all(pages.map(preloadPage));

// Social cards drawn by scripts/og.ts, as "../public/og/….png".
const cards = Object.keys(import.meta.glob("../public/og/**/*.png"));

// Every in-site link must land on a page that exists.
function resolves(href: string) {
  const { pathname } = new URL(href, "https://example.com");
  if (isFile(pathname)) return pathname === notesFeed.path;
  const route = matchRoute(pathname);
  if (route.name === "work") return caseStudies.some((study) => study.slug === route.slug);
  if (route.name === "note") return notes.some((note) => note.slug === route.slug);
  return route.name !== "missing";
}

describe("home page", () => {
  const html = render("/");

  it("renders the hero headline as the only h1", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html.replace(/<[^>]+>/g, "")).toContain(
      "An ai-native product designer with agents in the loop",
    );
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
    // Anchors only: <link> tags (font preloads, canonical) aren't site links.
    const hrefs = [...html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)].map((m) => m[1]);
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

describe("seo", () => {
  const head = (html: string, pattern: RegExp) => [...html.matchAll(pattern)].map((m) => m[1]);

  it("has an entry for every case study and note", () => {
    for (const study of caseStudies) expect(pages).toContain(`/work/${study.slug}`);
    for (const note of notes) expect(pages).toContain(`/notes/${note.slug}`);
  });

  it.each(pages)("%s has one title, a description and its own canonical URL", (path) => {
    const html = render(path);
    expect(head(html, /<title>([^<]*)<\/title>/g)).toHaveLength(1);
    expect(head(html, /<meta name="description" content="([^"]+)"/g)).toHaveLength(1);
    expect(head(html, /<link rel="canonical" href="([^"]+)"/g)).toEqual([absolute(path)]);
    expect(html).not.toContain("noindex");
  });

  it.each(pages)("%s has a social card that exists and valid structured data", (path) => {
    const html = render(path);
    const image = ogImage(path);
    expect(head(html, /<meta property="og:image" content="([^"]+)"/g)).toEqual([absolute(image)]);
    expect(cards, `run vp run og to draw ${image}`).toContain(`../public${image}`);
    const [json] = head(html, /<script type="application\/ld\+json">(.*?)<\/script>/g);
    const graph = JSON.parse(json)["@graph"];
    expect(graph.length).toBeGreaterThan(0);
    for (const node of graph) expect(node["@type"]).toBeTruthy();
  });

  it.each(seoPages.filter((page) => page.type === "article"))(
    "$path carries publish and modified dates",
    ({ path, published, updated }) => {
      expect(published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const html = render(path);
      expect(head(html, /<meta property="article:published_time" content="([^"]+)"/g)).toEqual([
        published,
      ]);
      expect(head(html, /<meta property="article:modified_time" content="([^"]+)"/g)).toEqual([
        updated ?? published,
      ]);
      const [json] = head(html, /<script type="application\/ld\+json">(.*?)<\/script>/g);
      const article = JSON.parse(json)["@graph"].find(
        (node: { "@type": string }) =>
          node["@type"] === "Article" || node["@type"] === "BlogPosting",
      );
      expect(article.datePublished).toBe(published);
      expect(article.dateModified).toBe(updated ?? published);
    },
  );

  it("gives every page a unique title and description", () => {
    expect(new Set(seoPages.map((page) => page.title)).size).toBe(seoPages.length);
    expect(new Set(seoPages.map((page) => page.description)).size).toBe(seoPages.length);
  });

  it("keeps the not-found page out of the index", () => {
    const html = render("/nope");
    expect(html).toContain(`<meta name="robots" content="noindex"/>`);
    expect(html).not.toContain(`rel="canonical"`);
  });

  it.each(pages)("%s links the notes feed", (path) => {
    const html = render(path);
    expect(html).toContain(
      `<link rel="alternate" type="application/atom+xml" title="${notesFeed.title}" href="${absolute(notesFeed.path)}"/>`,
    );
  });

  it("uses an https origin without a trailing slash", () => {
    expect(site.url).toMatch(/^https:\/\/[^/]+$/);
  });
});

const xml = await feed();

describe("feed", () => {
  const ids = [...xml.matchAll(/<entry>\s*<id>([^<]+)<\/id>/g)].map((m) => m[1]);

  it("lists every note, newest first", () => {
    expect(ids).toEqual(notes.map((note) => absolute(`/notes/${note.slug}`)));
  });

  it("only uses absolute links, in the markup and in the note bodies", () => {
    const hrefs = [...xml.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThan(notes.length);
    for (const href of hrefs) expect(href).toMatch(/^https:\/\//);
    // Inside <content type="html"> the markup is escaped: `"` is &#34;.
    expect(xml).not.toMatch(/(?:href|src)=&#34;(?!https:)/);
  });

  it("carries each note's body, with no form controls from the demos", () => {
    const contents = [...xml.matchAll(/<content type="html">([^<]*)<\/content>/g)];
    expect(contents).toHaveLength(notes.length);
    for (const [, body] of contents) expect(body.length).toBeGreaterThan(200);
    expect(xml).not.toContain("&#60;input");
  });
});
