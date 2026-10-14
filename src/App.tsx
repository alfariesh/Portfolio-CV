import { ViewTransition } from "react";
import { findCaseStudy } from "./case-studies";
import { Backdrop } from "./components/Backdrop";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { findNote } from "./notes";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { Home } from "./pages/Home";
import { MissingPage } from "./pages/MissingPage";
import { NotePage } from "./pages/NotePage";
import { NotesPage } from "./pages/NotesPage";
import { useRouter } from "./router/context";
import { Router } from "./router/Router";
import type { Route } from "./router/routes";

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Home />;
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
  return (
    <>
      <div className="sheet" id="top" aria-busy={isPending || undefined}>
        <Backdrop />
        <Nav />
        <ViewTransition key={pathname} default="none" enter={swap} exit={swap}>
          <main>
            <Page route={route} />
          </main>
        </ViewTransition>
      </div>
      <Footer />
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
