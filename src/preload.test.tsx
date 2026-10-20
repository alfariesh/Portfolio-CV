import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";
import { pages } from "./seo";

// Each page has to render with nothing loaded but its own chunks: that's all
// the client fetches before it hydrates or navigates there. A fresh module
// graph per page keeps chunks loaded for one page from covering for another.
describe.each([...pages.map((page) => page.path), "/nope"])("page %s", (url) => {
  it("renders with only the chunks preloadPage loads", async () => {
    vi.resetModules();
    const { default: App } = await import("./App");
    const { preloadPage } = await import("./preload");
    await preloadPage(url);
    // renderToString throws when a component suspends outside a boundary.
    expect(() => renderToString(<App url={url} />)).not.toThrow();
  });
});
