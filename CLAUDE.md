# Salman Alfariesh — portfolio

Portfolio in the style of paper.design: a home page, work (`/work`, `/work/<slug>`: six case studies, three featured on home: Rekanesia, Surau, iPubers) and notes (`/notes`, `/notes/<slug>`). React 19.3 + TypeScript on Vite+ 1.1.0, pnpm (pinned via `devEngines`). A small hand-written router, no backend. The user writes in Indonesian; site copy is English, lowercase, paper.design voice.

## Setup notes

- The home directory has its own `pnpm-workspace.yaml`. This project keeps a local `pnpm-workspace.yaml` so it stays a standalone workspace root; don't delete it.
- `vp dev` serves on port 5173 (`.claude/launch.json` runs it for the preview pane). `vp run build` is the real build: `tsc -b`, the client build, a server build into `dist-ssr/` and `scripts/prerender.ts`. Plain `vp build` only makes the client bundle (an empty SPA shell, no prerendered pages).
- The pre-commit hook runs `vp check --fix` on staged files. There is no git remote yet.
- Every page is prerendered to its own HTML file (`/work/numi` → `dist/work/numi.html`) and hydrated with `hydrateRoot`; unknown paths get `dist/404.html` with a 404 status. `vp dev` still renders client-side from an empty root.

## Deploy (Cloudflare Workers)

- Hosted as a Worker with static assets: `wrangler.jsonc` (config, `not_found_handling: "404-page"`), `public/_headers` (security headers, a year of `immutable` caching for `/assets/*`), `worker/index.ts` (a tiny Worker, type-checked through `tsconfig.worker.json`). Files in `dist/` and browser navigations never invoke the Worker (free, unlimited); it only runs when nothing matches and the request isn't a navigation, and answers an uncacheable 404 for a missing `/assets/*` file so an old chunk never gets a 404 cached as immutable.
- `vp run deploy` builds and deploys to production; `vp run deploy:preview` uploads a version with its own preview URL without promoting it; `vp run preview:cf` serves the build locally in workerd. The preview pane's `cloudflare` entry runs `wrangler dev` on port 8787 (serves the existing `dist/`, so build first). Roll back with `vp exec wrangler rollback`.
- `wrangler` is a local dev dependency (`vp exec wrangler …`). pnpm's minimum release age blocks versions published in the last day; don't add `minimumReleaseAgeExclude` to force one.
- The CSP in `_headers` allows only same-origin scripts (no inline). Inline styles are allowed because iso figures and React set them. Adding an external script, font, image or analytics beacon means extending the CSP.
- `src/main.tsx` reloads the page once on `vite:preloadError`: after a deploy, a tab still on the old build can't load its lazy chunks.

## SEO

- `src/seo.ts` is the registry: one entry per indexable URL with its title (`page | Salman Alfariesh`), description, social card and schema.org nodes (WebSite + ProfilePage on home, Article per case study, BlogPosting per note, BreadcrumbList below home). `site.url` is the canonical origin; change it there when a custom domain is added. A new page needs an entry here, or `seoFor` throws.
- `<Seo path>` (`src/components/Seo.tsx`) renders the head tags; React hoists them and swaps them on navigation. `<NoIndex>` is for the 404. JSON-LD is a data block, so the CSP doesn't need to allow it.
- `scripts/prerender.ts` moves React's hoisted tags (`<title>`, `<meta>`, `<link>`, the figures' `<style precedence>`) into `<head>`, writes the pages, `404.html`, `sitemap.xml` and `robots.txt`, and fails the build on a missing or doubled `<title>` or a Suspense boundary the server gave up on.
- Lazy WebGL pieces (`PaperFibre`, `PaperPlayground`) go inside `<ClientOnly>`: the server can't wait for a lazy chunk, and hydrating a boundary it gave up on logs React error 419 in every visitor's console.
- Social cards (`public/og/**.png`, 1200×630) and the PNG favicons (`favicon-96.png`, `apple-touch-icon.png`; Google doesn't read SVG favicons) are committed. `vp run og` redraws them in headless Chrome from `/social-cards/` (`src/og/*`, dev only); rerun it after changing a page's card or figure, or adding a page (a test checks every page has its card).
- Fonts: `App.tsx` preloads HarmonyOS Sans Regular and Bold (body and headlines), the first text on every page.

## Where things live

- `src/content.ts`: copy and links for the home page, nav and footer. The home page reads about (stats and a fact sheet: experience, education, awards, expertise, from the old portfolio's `experience.ts`), process, work, notes, contact. Every nav item is a home section in that order (`/#about`, `/#process`, `/#work`, `/#notes`); `page` marks the index page that also counts as it. `useNavCurrent` (`src/components/useNavCurrent.ts`) is the scroll-spy shared by the sticky header (it tucks in to the grid width once the page scrolls, ≥961px) and the bottom bar. The email is `hi@salman.ai.id`; the résumé and social links are still placeholders (`#`) and must be replaced before publishing.
- `src/case-studies/*.mdx` and `src/notes/*.mdx`: one file per case study or note, `export const meta = {...}` on top (types in each folder's `index.ts`), the file name is the slug. Case studies must include `<AiLoop>` (the "ai in the loop" section; a test enforces it; `columns={["the machine", …]}` when the AI sits inside the product rather than the process). Notes take one tag: experiment, workflow, essay or demo. Draft copy is marked with `TODO` comments.
- Case study facts come from the user's previous portfolio: `~/Documents/GitHub/portfolio/content/projects/<slug>/overview.mdx` and `metadata.ts` (ipubers, numi, rekan, rekanesia, surau, vuboi). Don't invent projects, numbers or anecdotes; there is no "Chicken Bank".
- `src/iso/*`: every illustration is an iso-glow figure (interactive isometric SVG, from the `iso-glow` skill). `kernel.ts` is the projection kernel, `IsoFigure.tsx` the host (draws in a layout effect, runs the demo on mount or when scrolled into view, optional shared view-transition `name`), `iso.css` the light-theme vocabulary and tokens (ember accent `#FF7A1A`, no glow), `figures/*.ts` one figure each, keyed in `figures/index.ts`. Case studies pick a figure in `meta.art` (4:3), notes in `meta.cover` (3:2). `vp dev` serves a gallery of all figures at `/iso-glow/` (`?fig=<key>&aspect=3/2&w=540`); `iso-glow/ipubers.html` is the original standalone asset.
- `src/components/prose/*`: components MDX files can use without importing (`AiLoop`, `Workflow`, `Callout`, `Stats`, `PaperDemo`), plus heading ids and router links for markdown.
- `src/router/*`: `Router` runs route changes in a Transition so `<ViewTransition>` animates them. It intercepts links and back/forward through the Navigation API, scrolls synchronously in a layout effect (before the browser captures the new page), and ignores React's own `info: "react-transition"` navigations. `Link` only steps in for browsers without the Navigation API. Pages live in `src/pages/*`.
- Transitions: `App.tsx` wraps each page in a keyed `<ViewTransition>` (types `nav-forward` / `nav-back`); `<ProjectArt>` (`art-<key>`) and `<NoteCover>` (`note-cover-<slug>`) are shared elements. Shared names must stay unique per page. CSS is at the end of `src/styles/pages.css`.
- `src/index.css`: tokens, layout, grid, footer, responsive rules. `src/styles/canvas.css` styles the hero canvas window, `src/styles/art.css` the hero canvas pieces, `src/styles/pages.css` case studies, notes, prose and view transitions, `src/iso/iso.css` the figures.
- `src/art/*` and `src/components/CanvasMock.tsx`: the hero canvas (cursors, chips, mini phone screens), drawn at a fixed size and scaled by `<Scaler>`. Its height comes from `aspect-ratio`. CSS scales it (`100cqw / --scaler-width`, typed arithmetic) so the prerendered page is right before scripts run; `useLayoutEffect` writes the same `scale` to the DOM (not state) for other browsers, before paint and inside a view transition's snapshot.
- Icons and pictograms use the Rekanesia stroke-sharp set: inner SVG markup in `src/components/icon-data.ts` and `src/art/pictogram-markup.ts`, rendered with `dangerouslySetInnerHTML`, stroke width 1.5 inherited from the parent `<svg>`. Add new glyphs there in the same format.
- `src/components/PaperFibre.tsx`: static WebGL paper texture from `@paper-design/shaders-react` (Apache-2.0), lazy-loaded into its own chunk inside `<ClientOnly>`. Used in the backdrop, behind the footer and in the paper-texture demo note.
- `src/App.test.tsx`: renders every route with `react-dom/server` (`<App url="…" />`) and checks one `h1` per page, home anchors, that every in-site link resolves, image labels, the ai-in-the-loop section, note metadata and the SEO tags (one title, description, own canonical, an existing social card and valid JSON-LD per page; noindex on the 404). Its page list comes from `src/seo.ts`. Keep it passing when adding pages, sections or links.

## Design rules

- Tokens: ink `#181818`, ink-soft `#666666`, ink-muted `#909090`, paper `#FCFCF9`, paper-deep `#EFEFE4`, line `#D7D7D6`, accent `#81ACEC`, accent-ink `#2D6FCD` (accent text links, like paper.design's blue "read article →"). System sans; body 18/28, display 56/56 at −0.02em, labels 14px caps.
- Layout: 1321px container, 1082px two-column grid of bordered cells with 12px registration marks where lines meet (`.cell::before/::after`).
- Keep lines minimal. Only cell borders, registration marks, edge rulers and the fold edges (fill only, no stroke) are allowed. Do not add repeating background grids or graph-paper patterns to the page or cells; the user found them messy. (In the Paper reference the 120px grid tile is `no-repeat`, not a full grid.)
- Paper texture: keep `folds`, `wrinkles`, `crumples` and `drops` at 0 so it adds no lines. Render it outside `<Scaler>` at real size, and keep to about two WebGL instances per page.
- Iso figures use bare class names inside their SVG (`face`, `top`, `detail`, `label`, `glass`, `scr`, `led`, `wire`, `pulse`, `press`, `lit`, `hot`…). Don't define site-level CSS with those names: site 14px caps are `.caps`, the hero's mini screens `.mscr`.
- Don't use Paper's logo, wordmark or brand art. The "s" monogram in `Mark.tsx` and all illustrations are original.

## Paper (design reference)

- The paper.design clone lives in the Paper file "Tender harmony" (id `01M4WJJCNRE4Z5G3ZF931HD4RH`). Read it for reference only. Do not modify it (pages, artboards, tokens) unless the user explicitly asks in that request.
- Its page "Portfolio — Salman" holds a desktop recreation of this site from the first commit. It is out of date (it still has the old full-page grid) and is not kept in sync with the code.

## Verifying visually

- Use the browser pane for interactive checks. For full-page screenshots, headless Chrome works at desktop widths. It enforces a minimum window width of about 500px, so check 375px in the pane's mobile preset or through an iframe of that width.
- Headless Chrome with `--virtual-time-budget` freezes requestAnimationFrame and CSS transitions, so iso figures look half-lit and view transitions never run. Drive Chrome in real time over CDP instead (`--remote-debugging-port`, then navigate, wait, `Page.captureScreenshot`).
- When the browser pane is hidden it renders no frames while still reporting `visible`, so view transitions stall there; test transitions in real-time headless Chrome.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
