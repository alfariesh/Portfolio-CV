import { use } from "react";

// A module the client fetches on demand: one iso figure, or the body of one
// case study or note. `load` starts it (calling it again reuses the request);
// `useChunk` reads it during render. The client loads a page's chunks before
// it hydrates or navigates, and the server before it renders (src/preload.ts),
// so `useChunk` finds them already there and never suspends.
export type Chunk<T> = {
  /** Source path from the project root, how the build manifest names it. */
  src: string;
  load: () => Promise<T>;
  value?: T;
};

export function chunk<T>(src: string, importer: () => Promise<T>): Chunk<T> {
  let pending: Promise<T> | undefined;
  const self: Chunk<T> = {
    src,
    load: () =>
      (pending ??= importer().then(
        (value) => (self.value = value),
        (error: unknown) => {
          // Let the next load try again rather than keep the failure.
          pending = undefined;
          throw error;
        },
      )),
  };
  return self;
}

export function useChunk<T>(chunk: Chunk<T>): T {
  return chunk.value ?? use(chunk.load());
}
