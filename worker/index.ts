// Cloudflare serves every file in dist/ without running this Worker, and page
// navigations to any other path get index.html (not_found_handling in
// wrangler.jsonc). So this only runs for a request that matches no file and is
// not a browser navigation: a stale chunk, or a crawler asking for a page.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  fetch(request: Request, env: Env) {
    // A hashed file from an older build. Answer 404 instead of index.html,
    // which the /assets/* rule in _headers would cache as immutable for a year.
    if (new URL(request.url).pathname.startsWith("/assets/")) {
      return new Response("Not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }
    // Crawlers, link previews and curl send no Sec-Fetch-Mode, so they land
    // here: give them the app like a browser would get.
    return env.ASSETS.fetch(request);
  },
};
