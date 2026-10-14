import type { Tag as TagName } from "../notes";

export function Tag({ tag }: { tag: TagName }) {
  return (
    <span className={`tag tag--${tag}`}>
      <i aria-hidden="true" />
      {tag}
    </span>
  );
}
