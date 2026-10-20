import type { MDXContent } from "mdx/types";
import { createElement } from "react";
import { useChunk, type Chunk } from "../../chunk";
import { proseComponents } from ".";

// The body of a case study or a note, from its own chunk. The component is the
// MDX file's default export, the same function on every render.
export function ProseBody({ body }: { body: Chunk<MDXContent> }) {
  return createElement(useChunk(body), { components: proseComponents });
}
