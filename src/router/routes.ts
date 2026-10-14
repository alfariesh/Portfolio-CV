export type Route =
  | { name: "home" }
  | { name: "work"; slug: string }
  | { name: "notes" }
  | { name: "note"; slug: string }
  | { name: "missing" };

export function matchRoute(pathname: string): Route {
  const [section, slug, ...rest] = pathname.split("/").filter(Boolean);
  if (!section) return { name: "home" };
  if (rest.length > 0) return { name: "missing" };
  if (section === "work" && slug) return { name: "work", slug };
  if (section === "notes") return slug ? { name: "note", slug } : { name: "notes" };
  return { name: "missing" };
}

// Going up to a parent page (a note back to /notes, anything back to /) slides
// back; everything else slides forward.
export function directionOf(from: string, to: string): NavDirection {
  const isParent = to === "/" || from.startsWith(to.endsWith("/") ? to : `${to}/`);
  return isParent && from !== to ? "nav-back" : "nav-forward";
}

export type NavDirection = "nav-forward" | "nav-back";

// Navigation API: Chrome, Edge, Safari 26.2+, Firefox 147+.
export const getNavigation = () => (window as { navigation?: Navigation }).navigation;
