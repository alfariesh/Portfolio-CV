import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  // The vendored iso-glow skill stays byte-for-byte as published.
  fmt: {
    ignorePatterns: [".claude/skills/**"],
  },
  lint: {
    ignorePatterns: [".claude/skills/**"],
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  // Case studies and notes are MDX files in src/case-studies and src/notes.
  // MDX compiles them to React components before the React plugin sees them.
  plugins: lazyPlugins(() => [
    { enforce: "pre", ...mdx() },
    react({ include: /\.(mdx|jsx|tsx|ts|js)$/ }),
  ]),
});
