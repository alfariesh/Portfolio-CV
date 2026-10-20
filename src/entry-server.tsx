// Server entry for the prerender (scripts/prerender.ts), built with
// `vp build --ssr`. Renders one page to HTML; the client hydrates it.
import { renderToString } from "react-dom/server";
import App from "./App";
import { preloadPage } from "./preload";

export { chunksFor } from "./preload";
export { notesFeed, pages, site } from "./seo";
export { escapeXml, feed } from "./feed";

export async function render(url: string) {
  // renderToString can't wait for a lazy chunk, so load the page's first.
  await preloadPage(url);
  return renderToString(<App url={url} />);
}
