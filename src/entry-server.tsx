// Server entry for the prerender (scripts/prerender.ts), built with
// `vp build --ssr`. Renders one page to HTML; the client hydrates it.
import { renderToString } from "react-dom/server";
import App from "./App";

export { pages, site } from "./seo";

export function render(url: string) {
  return renderToString(<App url={url} />);
}
