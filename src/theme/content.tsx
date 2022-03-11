import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DRAWER_WIDTH, NAVBAR_HEIGHT } from "./constants";

type Props = {
	isOpen: boolean;
	children?: ReactNode;
};

export const StyledContent = ({ isOpen, children = null }: Props) => {
	const theme = useTheme();
	const isMD = useMediaQuery(theme.breakpoints.up("md"));

	const resize = isOpen && isMD;

	return (
		<Box
			component="main"
			sx={{
				minHeight: "100vh",
				paddingTop: `${NAVBAR_HEIGHT}px`,
				marginLeft: resize ? `${DRAWER_WIDTH}px` : 0,
				width: resize ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
				transition: theme.transitions.create(["margin", "width"], {
					easing: isOpen
						? theme.transitions.easing.easeOut
						: theme.transitions.easing.sharp,
					duration: isOpen
						? theme.transitions.duration.enteringScreen
						: theme.transitions.duration.leavingScreen,
				}),
				backgroundColor: theme.palette.grey[100],
			}}
		>
			<Box sx={{ padding: 3 }}>{children}</Box>
		</Box>
	);
};
