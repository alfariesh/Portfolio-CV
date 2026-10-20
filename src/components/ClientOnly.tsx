import { Suspense, useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

// For lazy WebGL pieces (the paper textures, the playground). The prerender
// can't wait for a lazy chunk, and hydrating a boundary it gave up on logs a
// recoverable error, so the server and the hydrating render both show nothing
// and React renders the children right after hydration.
export function ClientOnly({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return isClient ? <Suspense fallback={null}>{children}</Suspense> : null;
}
