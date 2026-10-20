import { createContext, use } from "react";
import type { Route } from "./routes";

export type RouterValue = {
  route: Route;
  pathname: string;
  isPending: boolean;
  navigate: (href: string) => void;
};

export const RouterContext = createContext<RouterValue | null>(null);

export function useRouter() {
  const value = use(RouterContext);
  if (!value) throw new Error("useRouter must be used inside <Router>");
  return value;
}
