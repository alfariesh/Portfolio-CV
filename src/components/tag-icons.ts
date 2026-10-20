import type { Tag } from "../notes";
import type { IconName } from "./Icon";

export const tagIcons: Record<Tag | "all", IconName> = {
  all: "grid",
  experiment: "flask",
  workflow: "flow",
  prompt: "prompt",
  agent: "robot",
  "design-system": "shapes",
  plugin: "plug",
  illustration: "brush",
  essay: "essay",
  video: "play",
};
