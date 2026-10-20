# salman — portfolio

The portfolio of [Salman Alfariesh](https://salman-alfariesh.alfarieshsalman.workers.dev),
a product designer and design engineer: six case studies, a handful of notes,
and a page that reads like a sheet of paper. The layout is an homage to
[paper.design](https://paper.design); every illustration is an interactive
isometric figure drawn with [iso-glow](https://iso-glow.vercel.app).

Built with React 19 and TypeScript on [Vite+](https://viteplus.dev),
prerendered to static HTML and served from Cloudflare Workers.

## What's inside

- **Static, then hydrated.** Every page is rendered to its own HTML file at
  build time and hydrated with `hydrateRoot`. No backend, no client-side data
  fetching, a real 404 status for unknown paths.
- **A ~130-line router** on the Navigation API, with React's
  `<ViewTransition>` animating page changes and shared elements (a case
  study's figure flies from the list into the page).
- **MDX content.** One file per case study or note, typed metadata on top.
- **Interactive iso figures.** Isometric SVG drawn from a small projection
  kernel; each figure does something real when clicked and runs a short demo
  when scrolled into view.
- **SEO from one registry.** Titles, canonical URLs, social cards and
  schema.org JSON-LD for every page come from `src/seo.ts`; the build writes
  `sitemap.xml` and `robots.txt` and fails on a missing title.
- **Strict CSP.** Same-origin scripts only, a year of immutable caching for
  hashed assets, and a 30-line Worker that keeps stale chunks from being
  cached as 404s.

## Getting started

You need [Vite+](https://viteplus.dev/guide/install) (`vp`). It manages Node
(see `.node-version`) and pnpm (pinned in `package.json`) for you.

```bash
vp install      # install dependencies
vp dev          # dev server on http://localhost:5173
vp check        # format, lint and type-check
vp test         # render every route and check links, headings and SEO tags
vp run build    # the real build: type-check, bundle, prerender every page
```

`vp run <script>` runs a `package.json` script; plain `vp build` only makes
the client bundle (an empty SPA shell with no prerendered pages).

Dev-only pages: `/iso-glow/` is a gallery of every figure
(`?fig=<key>&aspect=3/2&w=540`), `/social-cards/` draws the social cards that
`vp run og` screenshots into `public/og/` (needs Google Chrome; set
`CHROME_PATH` if it is not in the default macOS location).

## Project layout

```
src/
  content.ts          home page, nav and footer copy; the profile
  seo.ts              one entry per page: title, description, card, JSON-LD
  case-studies/*.mdx  one file per case study (file name = slug)
  notes/*.mdx         one file per note
  pages/              Home, Work, Notes, a case study, a note, 404
  components/         layout, nav, footer, hero canvas, prose components
  iso/                kernel, figure host, light theme and one file per figure
  router/             Navigation API router and <Link>
  styles/             page, canvas and art styles (tokens live in index.css)
  og/                 social card layouts (dev only)
scripts/
  prerender.ts        writes dist/**.html, 404.html, sitemap.xml, robots.txt
  og.ts               redraws public/og/** and the PNG favicons
worker/index.ts       the Cloudflare Worker (runs only for unmatched requests)
public/_headers       security headers and caching rules
```

## Deploy (Cloudflare Workers)

The site is a Worker with static assets (`wrangler.jsonc`).

```bash
vp exec wrangler login   # once per machine
vp run deploy            # build and deploy to production
vp run deploy:preview    # upload a version with its own preview URL
vp run preview:cf        # build and serve locally the way Cloudflare does
vp exec wrangler rollback
```

CI (`.github/workflows/ci.yml`) runs `vp check`, `vp test` and the full build
on every push and pull request. Pushes to `main` also deploy once the repo
has a `CLOUDFLARE_ACCOUNT_ID` variable and a `CLOUDFLARE_API_TOKEN` secret
(token template "Edit Cloudflare Workers"); until then the deploy job is
skipped. Set the optional `SITE_URL` variable to show the live URL on the
deployment.

## Forking

You're welcome to use the code for your own site. The content isn't part of
the MIT license, so swap it out:

1. `src/content.ts`: your profile, copy, socials and fact sheet.
2. `src/case-studies/*.mdx`, `src/notes/*.mdx`: your own work and writing.
3. `src/iso/figures/*`: draw your own figures (the iso-glow skill in
   `.claude/skills/iso-glow` helps, see below), then point each page's
   `meta.art` / `meta.cover` at them.
4. `src/seo.ts`: `site.url`, your canonical origin.
5. `wrangler.jsonc`: the Worker `name`.
6. `vp run og` to redraw the social cards, then `vp test`.

## Working with Claude Code

The repo is set up for [Claude Code](https://claude.com/claude-code):
`CLAUDE.md` describes the architecture and design rules, and
`.claude/skills/iso-glow` is the iso-glow skill (MIT, by April Zhu, built on
Tolga Cohce's iso-figure), so "draw an iso figure of …" works out of the box
in this folder. `.claude/launch.json` defines the dev servers for the
desktop app's preview pane.

## License

The **code** is [MIT](LICENSE). The **content** (case studies, notes, site
copy, the iso figures, the monogram and the social cards) is © Salman
Alfariesh, all rights reserved; [LICENSE](LICENSE) lists the exact paths.
Fonts, icons and the iso-glow skill keep their own licenses:
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
