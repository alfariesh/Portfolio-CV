// Dev-only social cards, served by `vp dev` at /social-cards/. ?path=/work/numi
// shows that page's 1200×630 card alone, which scripts/og.ts screenshots into
// public/og/; without it, every card is laid out for review.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/caveat/wght.css";
import "../index.css";
import "../iso/iso.css";
import { pages } from "../seo";
import { Card } from "./Card";

// How long the figures' demos take to leave them lit (the longest is ~5s).
const settle = 6500;

const path = new URLSearchParams(location.search).get("path");
const shown = path ? pages.filter((page) => page.path === path) : pages;

// scripts/og.ts reads the list of cards and waits for the ready flag.
Object.assign(window, { ogPaths: pages.map((page) => page.path) });
void document.fonts.ready.then(() =>
  setTimeout(() => (document.documentElement.dataset.ready = "true"), settle),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className={path ? "og-single" : "og-gallery"}>
      {shown.map((page) => (
        <Card key={page.path} page={page} />
      ))}
    </main>
  </StrictMode>,
);
