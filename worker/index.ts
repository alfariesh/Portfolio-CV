// Cloudflare serves every file in dist/ without running this Worker, and page
// navigations to any other path get 404.html (not_found_handling in
// wrangler.jsonc). So this only runs for a request that matches no file and is
// not a browser navigation: a stale chunk, or a crawler probing a dead URL.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  fetch(request: Request, env: Env) {
    // A hashed file from an older build. Answer an uncacheable 404: through
    // the asset store it would carry the /assets/* rule from _headers and be
    // cached as immutable for a year, breaking that file after a rollback.
    if (new URL(request.url).pathname.startsWith("/assets/")) {
      return new Response("Not found", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }
    // Anything else gets what a browser would: 404.html with a 404 status.
    return env.ASSETS.fetch(request);
  },
};
