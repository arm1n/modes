import type { ReactNode } from "react";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export type Props = {
	href: string;
	selected: boolean;
	children: ReactNode;
};

export const MenuItem = ({ href, children, selected }: Props) => (
	<ListItemButton href={href} selected={selected}>
		<ListItemText primary={children} />
	</ListItemButton>
);
