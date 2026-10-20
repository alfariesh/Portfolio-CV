import type { Tag as TagName } from "../notes";
import { Icon } from "./Icon";
import { tagIcons } from "./tag-icons";

export function Tag({ tag }: { tag: TagName }) {
  return (
    <span className={`tag tag--${tag}`}>
      <Icon name={tagIcons[tag]} size={14} />
      {tag}
    </span>
  );
}
