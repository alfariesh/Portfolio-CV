import { iconMarkup } from "./icon-data";

export type IconName = keyof typeof iconMarkup;

type IconProps = { name: IconName; size?: number; strokeWidth?: number; className?: string };

export function Icon({ name, size = 16, strokeWidth = 1.5, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconMarkup[name] }}
    />
  );
}
