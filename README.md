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
vp build        # production build into dist/
vp preview      # serve the production build
```

`vp run <script>` runs a `package.json` script instead of the built-in
command (for example `vp run build` also runs `tsc -b`).

## Editing

- **Copy and links:** `src/content.ts`. Replace the placeholder email,
  résumé link and social links before publishing.
- **Tokens and layout:** `src/index.css` (colors, type scale, grid, footer).
- **Hero canvas window:** `src/components/CanvasMock.tsx` + `src/styles/canvas.css`.
- **Project illustrations:** `src/art/*` + `src/styles/art.css`. Each one is
  drawn at a fixed size and scaled down by `<Scaler>` on small screens.
