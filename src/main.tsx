import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/caveat/wght.css";
import "./index.css";
import "./styles/canvas.css";
import "./styles/art.css";
import "./styles/pages.css";
import "./iso/iso.css";
import App from "./App.tsx";

// A deploy replaces every hashed file in /assets, so a tab still running the
// old build fails to load its lazy chunks (the paper texture, the playground).
// Reload once to pick up the new index.html; the timestamp stops a loop when
// a chunk is broken for good.
window.addEventListener("vite:preloadError", (event) => {
  const last = Number(sessionStorage.getItem("chunk-reload") ?? 0);
  if (Date.now() - last < 10_000) return;
  sessionStorage.setItem("chunk-reload", String(Date.now()));
  event.preventDefault();
  window.location.reload();
});

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The build prerenders every page (scripts/prerender.ts), so React adopts the
// HTML that is already there. `vp dev` serves an empty root and renders fresh.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
