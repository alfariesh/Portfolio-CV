import { createElement, ViewTransition, type ComponentType } from "react";
import { preload } from "react-dom";
import { findCaseStudy } from "./case-studies";
import { Backdrop } from "./components/Backdrop";
import { BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { findNote } from "./notes";
import { useChunk, type Chunk } from "./chunk";
import { pageChunks } from "./pages/chunks";
import { MissingPage } from "./pages/MissingPage";
import { preloadPage } from "./preload";
import { useRouter } from "./router/context";
import { Router } from "./router/Router";
import type { Route } from "./router/routes";
import googleSans from "./fonts/GoogleSans-latin.woff2?url";

// Reads a page's chunk (loaded before this renders, see src/preload.ts) and
// draws it.
function Loaded<P extends object>({ page, props }: { page: Chunk<ComponentType<P>>; props: P }) {
  return createElement(useChunk(page), props);
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Loaded page={pageChunks.home} props={{}} />;
    case "works":
      return <Loaded page={pageChunks.works} props={{}} />;
    case "work": {
      const study = findCaseStudy(route.slug);
      return study ? <Loaded page={pageChunks.work} props={{ study }} /> : <MissingPage />;
    }
    case "notes":
      return <Loaded page={pageChunks.notes} props={{}} />;
    case "note": {
      const note = findNote(route.slug);
      return note ? <Loaded page={pageChunks.note} props={{ note }} /> : <MissingPage />;
    }
    case "resume":
      return <Loaded page={pageChunks.resume} props={{}} />;
    default:
      return <MissingPage />;
  }
}

// Page swaps slide with the direction of travel; see "View transitions" in
// src/styles/pages.css.
const swap = { "nav-forward": "page-forward", "nav-back": "page-back", default: "none" };

function Site() {
  const { route, pathname, isPending } = useRouter();
  // One variable font covers body and headlines on every page. Preloading it
  // (a <link> in the prerendered head) saves the round trip after the CSS.
  preload(googleSans, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>
      <div className="sheet" id="top" aria-busy={isPending || undefined}>
        <Backdrop />
        <Nav />
        <ViewTransition key={pathname} default="none" enter={swap} exit={swap}>
          <main id="main" tabIndex={-1}>
            <Page route={route} />
          </main>
        </ViewTransition>
      </div>
      <Footer />
      <BottomNav />
    </>
  );
}

export default function App({ url }: { url?: string }) {
  return (
    <Router url={url} preload={preloadPage}>
      <Site />
    </Router>
  );
}
