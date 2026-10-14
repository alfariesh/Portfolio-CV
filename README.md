# Salman Alfariesh — portfolio

A single-page portfolio in the style of paper.design: a paper sheet with
zig-zag folds, rulers, a bordered two-column grid and a footer that is
revealed from under the page. Built with React + TypeScript on
[Vite+](https://viteplus.dev).

## Commands

```bash
vp install      # install dependencies
vp dev          # dev server on http://localhost:5173
vp check        # format, lint and type-check
vp test         # run tests
vp run build    # production build into dist/, every page prerendered
vp preview      # serve the production build
vp run og       # redraw the social cards and PNG favicons (needs Chrome)
```

`vp run <script>` runs a `package.json` script instead of the built-in
command. Plain `vp build` only makes the client bundle; `vp run build` also
type-checks and prerenders every page to static HTML.

## Deploy

The site runs on Cloudflare Workers with static assets (`wrangler.jsonc`).

```bash
vp exec wrangler login   # once per machine
vp run deploy            # build and deploy to production
vp run deploy:preview    # build and upload a version with its own preview URL
vp run preview:cf        # build and serve it locally the way Cloudflare does
```

Security headers and caching rules are in `public/_headers`.

## SEO

Titles, descriptions, canonical URLs, social cards and structured data for
every page live in `src/seo.ts`; the build writes them into each page's
static HTML along with `sitemap.xml` and `robots.txt`. When the site moves to
a custom domain, change `site.url` there and redeploy.

## Editing

- **Copy and links:** `src/content.ts`. Replace the placeholder email,
  résumé link and social links before publishing.
- **Tokens and layout:** `src/index.css` (colors, type scale, grid, footer).
- **Hero canvas window:** `src/components/CanvasMock.tsx` + `src/styles/canvas.css`.
- **Project illustrations:** `src/art/*` + `src/styles/art.css`. Each one is
  drawn at a fixed size and scaled down by `<Scaler>` on small screens.
