import { ViewTransition } from "react";
import { preload } from "react-dom";
import { findCaseStudy } from "./case-studies";
import { Backdrop } from "./components/Backdrop";
import { BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { findNote } from "./notes";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { Home } from "./pages/Home";
import { MissingPage } from "./pages/MissingPage";
import { NotePage } from "./pages/NotePage";
import { NotesPage } from "./pages/NotesPage";
import { WorkPage } from "./pages/WorkPage";
import { useRouter } from "./router/context";
import { Router } from "./router/Router";
import type { Route } from "./router/routes";
import bold from "./fonts/HarmonyOS_Sans_Bold.woff2?url";
import regular from "./fonts/HarmonyOS_Sans_Regular.woff2?url";

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Home />;
    case "works":
      return <WorkPage />;
    case "work": {
      const study = findCaseStudy(route.slug);
      return study ? <CaseStudyPage study={study} /> : <MissingPage />;
    }
    case "notes":
      return <NotesPage />;
    case "note": {
      const note = findNote(route.slug);
      return note ? <NotePage note={note} /> : <MissingPage />;
    }
    default:
      return <MissingPage />;
  }
}

// Page swaps slide with the direction of travel; see "View transitions" in
// src/styles/pages.css.
const swap = { "nav-forward": "page-forward", "nav-back": "page-back", default: "none" };

function Site() {
  const { route, pathname, isPending } = useRouter();
  // Headlines are bold and body text regular on every page. Preloading them
  // (a <link> in the prerendered head) saves the round trip after the CSS.
  preload(regular, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload(bold, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
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
    <Router url={url}>
      <Site />
    </Router>
  );
}
