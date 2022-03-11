import { forwardRef } from "react";

import {
  Link,
} from "react-router-dom";
import type { LinkProps } from "react-router-dom";

export const LinkDecorator = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "to"> & { href: LinkProps["to"] }
>(({ href, ...props }, ref) => <Link ref={ref} to={href} {...props} />);