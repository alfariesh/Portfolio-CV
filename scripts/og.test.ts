import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vite-plus/test";

// The raw screenshots from scripts/og.ts are ~250 kB; every link preview
// fetches one, so they are shrunk to a 256-colour palette after drawing.
const dir = fileURLToPath(new URL("../public/og/", import.meta.url));

it("keeps every social card under 150 kB", () => {
  const cards = readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((file) =>
    file.endsWith(".png"),
  );
  expect(cards.length).toBeGreaterThan(0);
  for (const card of cards) {
    expect(statSync(join(dir, card)).size, `${card} is over 150 kB`).toBeLessThan(150_000);
  }
});
