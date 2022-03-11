import { useResolvedPath, useMatch } from "react-router-dom";

import { MenuItem } from "../theme";

export const MenuItemDecorator = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => {
  const { pathname: path } = useResolvedPath(href);
  const selected = !!useMatch({ path, end: true });

  return (
    <MenuItem href={href} selected={selected}>
      {text}
    </MenuItem>
  );
};
