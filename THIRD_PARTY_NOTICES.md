# Third-party notices

This site includes or adapts the following work. Each keeps its own license.

## iso-glow (MIT)

The isometric figures are built with the **iso-glow** skill by April Zhu,
which builds on **iso-figure** by Tolga Cohce
([github.com/MrBongoC/ai-iso-skill](https://github.com/MrBongoC/ai-iso-skill)).
<https://iso-glow.vercel.app>

- `.claude/skills/iso-glow/`: an unmodified copy of the skill, with its
  [LICENSE](.claude/skills/iso-glow/LICENSE).
- `src/iso/kernel.ts`: the projection kernel, ported to TypeScript.
- `src/iso/IsoFigure.tsx`, `src/iso/types.ts`, `src/iso/iso.css`: the figure
  host, figure contract and light theme, adapted from the skill's gallery shell.

```
MIT License

Copyright (c) 2026 April Zhu (iso-glow: lighting, palettes, gallery shell, examples)
Copyright (c) 2026 Tolga Cohce (iso-figure, on which iso-glow is based)
```

The full MIT text is in [.claude/skills/iso-glow/LICENSE](.claude/skills/iso-glow/LICENSE).

## Google Sans (SIL Open Font License 1.1)

`src/fonts/GoogleSans-latin.woff2` (the Latin subset of the variable font,
from Google Fonts), Copyright 2025 The Google Sans Project Authors.
License text: [src/fonts/LICENSE-Google-Sans.txt](src/fonts/LICENSE-Google-Sans.txt).

## Caveat (SIL Open Font License 1.1)

Loaded from `@fontsource-variable/caveat`. Caveat by Impallari Type.

## Paper Shaders (Apache-2.0)

`@paper-design/shaders-react` draws the paper texture
(`src/components/PaperFibre.tsx`). Paper's own logo, wordmark and brand art
are not used anywhere on the site; the layout is an homage to
[paper.design](https://paper.design).

## Tool logos

The tool logos in `src/components/tool-logos.ts` (Paper, Figma, Storybook,
ClickUp, Jump and one still unnamed) are the tools' own marks. They are
trademarks of their owners and appear only to name the tools the author uses.
They are not covered by this repository's MIT License.

## Rekanesia stroke-sharp icons

The icons and pictograms in `src/components/icon-data.ts` and
`src/art/pictogram-markup.ts` come from the Rekanesia design system, which
the author designed. They are not covered by this repository's MIT License.
