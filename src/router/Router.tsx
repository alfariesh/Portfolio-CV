import {
  addTransitionType,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { RouterContext } from "./context";
import { directionOf, getNavigation, isFile, matchRoute, type NavDirection } from "./routes";

type State = { pathname: string; settle: () => void };

const idle = () => {};

const currentPathname = () => (typeof window === "undefined" ? "/" : window.location.pathname);

// Route changes scroll synchronously and instantly (the page sets
// `scroll-behavior: smooth`), so the view transition captures the new page
// where it will stay. NavigateEvent.scroll() lands too late for that.
function scrollToHash(hash: string) {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (target) target.scrollIntoView({ behavior: "instant" });
  else window.scrollTo({ top: 0, behavior: "instant" });
}

// Scroll position of each history entry, for back and forward.
const scrollByEntry = new Map<string, number>();

type RouterProps = {
  url?: string;
  /** Fetches what a page needs to render, so a route change never suspends. */
  preload?: (pathname: string) => Promise<unknown>;
  children: ReactNode;
};

const ready = () => Promise.resolve();

// A small client router. Route changes run in a Transition so <ViewTransition>
// boundaries animate them. With the Navigation API every same-origin link and
// the back/forward buttons are intercepted; without it, <Link> pushes history
// itself and back/forward swap pages without animation. Each change waits for
// `preload` first, so the transition starts with the next page ready to draw.
export function Router({ url, preload = ready, children }: RouterProps) {
  // A failed load doesn't stop the route change: the page fetches what is
  // missing while it renders (and a stale build reloads, see src/main.tsx).
  const load = useCallback((pathname: string) => preload(pathname).catch(() => {}), [preload]);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<State>(() => ({
    pathname: url ?? currentPathname(),
    settle: idle,
  }));

  // Runs inside the view transition's update callback: the new page is in the
  // DOM, and the browser has not captured it yet.
  useLayoutEffect(() => {
    state.settle();
  }, [state]);

  const go = useCallback((pathname: string, direction: NavDirection, settle: () => void) => {
    startTransition(() => {
      addTransitionType(direction);
      setState({ pathname, settle });
    });
  }, []);

  useEffect(() => {
    const nav = getNavigation();
    if (nav) {
      const onNavigate = (event: NavigateEvent) => {
        if (
          !event.canIntercept ||
          event.hashChange ||
          event.downloadRequest !== null ||
          event.formData ||
          event.navigationType === "reload" ||
          isFile(new URL(event.destination.url).pathname) ||
          // React's own placeholder navigation for the browser loading indicator.
          event.info === "react-transition"
        ) {
          return;
        }
        const to = new URL(event.destination.url);
        const direction: NavDirection =
          event.navigationType === "traverse"
            ? event.destination.index < (nav.currentEntry?.index ?? 0)
              ? "nav-back"
              : "nav-forward"
            : directionOf(window.location.pathname, to.pathname);

        if (nav.currentEntry) scrollByEntry.set(nav.currentEntry.key, window.scrollY);
        const restore = () => {
          if (event.navigationType === "traverse") {
            const top = scrollByEntry.get(event.destination.key) ?? 0;
            window.scrollTo({ top, behavior: "instant" });
          } else if (event.navigationType !== "reload") {
            scrollToHash(to.hash);
          }
        };

        event.intercept({
          scroll: "manual",
          // React waits for this navigation to finish before it captures the
          // new page, so resolve as soon as the page has committed.
          handler: async () => {
            await load(to.pathname);
            // A newer navigation took over while this page was loading.
            if (event.signal.aborted) return;
            await new Promise<void>((resolve) => {
              go(to.pathname, direction, () => {
                restore();
                resolve();
              });
            });
          },
        });
      };
      nav.addEventListener("navigate", onNavigate);
      return () => nav.removeEventListener("navigate", onNavigate);
    }

    const onPopState = () => {
      const pathname = currentPathname();
      void load(pathname).then(() => {
        if (currentPathname() === pathname) setState({ pathname, settle: idle });
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [go, load]);

  // Start fetching a page as soon as a pointer or the focus reaches a link
  // to it, so the click rarely waits.
  useEffect(() => {
    const warm = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (link instanceof HTMLAnchorElement && link.origin === window.location.origin) {
        void load(link.pathname);
      }
    };
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    return () => {
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
    };
  }, [load]);

  const navigate = useCallback(
    (href: string) => {
      const to = new URL(href, window.location.href);
      const nav = getNavigation();
      if (nav) {
        nav.navigate(to.href);
        return;
      }
      const direction = directionOf(window.location.pathname, to.pathname);
      void load(to.pathname).then(() =>
        go(to.pathname, direction, () => {
          window.history.pushState(null, "", to.href);
          scrollToHash(to.hash);
        }),
      );
    },
    [go, load],
  );

  const value = useMemo(
    () => ({ route: matchRoute(state.pathname), pathname: state.pathname, isPending, navigate }),
    [state.pathname, isPending, navigate],
  );

  return <RouterContext value={value}>{children}</RouterContext>;
}
