import type { ComponentProps, MouseEvent } from "react";
import { useRouter } from "./context";
import { getNavigation } from "./routes";

type LinkProps = ComponentProps<"a"> & { href: string };

// An <a> for in-site links. With the Navigation API the router intercepts the
// click on its own; this only steps in for browsers without it.
export function Link({ href, onClick, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target ||
      getNavigation()
    ) {
      return;
    }
    const to = new URL(href, window.location.href);
    if (to.origin !== window.location.origin) return;
    if (to.pathname === window.location.pathname && to.hash) return;
    event.preventDefault();
    navigate(to.href);
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
