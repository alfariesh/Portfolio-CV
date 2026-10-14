import { pictogramMarkup } from "./pictogram-markup";
import type { PictogramName } from "./pictogram-data";

type PictogramProps = { name: PictogramName; size?: number; strokeWidth?: number };

export function Pictogram({ name, size = 24, strokeWidth = 1.5 }: PictogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: pictogramMarkup[name] }}
    />
  );
}
