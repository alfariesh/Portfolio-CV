// Turns the client build (dist/) into a static site: one HTML file per page in
// src/seo.ts, rendered by the server build (dist-ssr/), plus 404.html,
// sitemap.xml, robots.txt and the notes' Atom feed. Runs as the last step of `vp run build`.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

type ServerEntry = {
  render: (url: string) => Promise<string>;
  chunksFor: (url: string) => { src: string }[];
  pages: { path: string; published?: string }[];
  site: { url: string };
  escapeXml: (text: string) => string;
  feed: () => Promise<string>;
  notesFeed: { path: string };
};

type Manifest = Record<string, { file: string; imports?: string[]; isEntry?: boolean }>;

const dist = new URL("../dist/", import.meta.url);
const entry = new URL("../dist-ssr/entry-server.js", import.meta.url);
const { render, chunksFor, pages, site, escapeXml, feed, notesFeed } = (await import(
  entry.href
)) as ServerEntry;

const template = await readFile(new URL("index.html", dist), "utf8");
for (const marker of ["<!--app-head-->", "<!--app-html-->"]) {
  if (!template.includes(marker)) throw new Error(`index.html lost its ${marker} marker`);
}

// The client build's manifest maps each source file to its chunk. It's only
// needed here, so it doesn't stay in dist/ to be deployed.
const manifestDir = new URL(".vite/", dist);
const manifest = JSON.parse(
  await readFile(new URL("manifest.json", manifestDir), "utf8"),
) as Manifest;
await rm(manifestDir, { recursive: true });

// The page's own chunks (figures, its body) and the chunks they import, as
// modulepreload links: the browser fetches them alongside the entry script
// instead of after it, and src/main.tsx waits for them before hydrating.
function modulepreloads(url: string) {
  const files = new Set<string>();
  const add = (key: string) => {
    const chunk = manifest[key];
    if (!chunk) throw new Error(`${key} is not in the client build`);
    // The entry and what it imports are already in the template.
    if (chunk.isEntry || files.has(chunk.file) || template.includes(`/${chunk.file}"`)) return;
    files.add(chunk.file);
    chunk.imports?.forEach(add);
  };
  for (const { src } of chunksFor(url)) add(src);
  return [...files]
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`)
    .join("");
}

// Rendering anything short of a full document, React emits the hoisted
// <title>, <meta>, <link> and <style precedence> (the iso figures' CSS) tags
// ahead of the markup. They go in <head>, where hydration looks for them.
const hoisted = /^(?:<title>[^<]*<\/title>|<style\b[^>]*>[^<]*<\/style>|<(?:meta|link)\b[^>]*>)*/;

async function page(url: string) {
  const html = await render(url);
  const head = hoisted.exec(html)![0];
  const titles = head.match(/<title>/g)?.length ?? 0;
  if (titles !== 1) throw new Error(`${url} renders ${titles} <title> tags, expected 1`);
  // A Suspense boundary the server gave up on (a lazy chunk outside
  // <ClientOnly>) hydrates with a recoverable error in every visitor's console.
  if (html.includes("<!--$!-->")) throw new Error(`${url} has a client-rendered boundary`);
  // Replacer functions, so a "$&" in the copy is never read as a pattern.
  return template
    .replace("<!--app-head-->", () => head + modulepreloads(url))
    .replace("<!--app-html-->", () => html.slice(head.length));
}

async function write(file: string, content: string) {
  const target = new URL(file, dist);
  await mkdir(dirname(fileURLToPath(target)), { recursive: true });
  await writeFile(target, content);
}

// /work is written as work.html, which Cloudflare serves at /work and
// redirects /work/ and /work.html to (html_handling: auto-trailing-slash).
const fileFor = (path: string) => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

for (const { path } of pages) await write(fileFor(path), await page(path));
// Served with a 404 status for any unknown path (not_found_handling).
await write("404.html", await page("/404"));

const urls = pages.map(({ path, published }) => {
  const loc = `<loc>${escapeXml(new URL(path, site.url).href)}</loc>`;
  const lastmod = published ? `<lastmod>${published}</lastmod>` : "";
  return `  <url>${loc}${lastmod}</url>`;
});
await write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`,
);

await write(
  "robots.txt",
  `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", site.url).href}
`,
);

// Every note must be in the feed, under its own absolute URL.
const atom = await feed();
for (const { path } of pages.filter(({ path }) => path.startsWith("/notes/"))) {
  const id = `<id>${escapeXml(new URL(path, site.url).href)}</id>`;
  if (!atom.includes(id)) throw new Error(`${notesFeed.path} is missing ${path}`);
}
await write(notesFeed.path.slice(1), atom);

console.log(
  `prerendered ${pages.length} pages, 404.html, sitemap.xml, robots.txt and ${notesFeed.path}`,
);
