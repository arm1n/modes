import type { ReactNode } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { DRAWER_WIDTH } from "./constants";
import logo from "./logo.png";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
};

export const StyledDrawer = ({ isOpen, onClose, children = [] }: Props) => {
	const theme = useTheme();
	const isMD = useMediaQuery(theme.breakpoints.up("md"));

	return (
	<Box component="nav" sx={{ width: DRAWER_WIDTH }}>
		<Drawer
			open={isOpen}
			onClose={onClose}
			variant={isMD ? "persistent" : "temporary"}
			sx={{
				"& .MuiDrawer-paper": {
					width: DRAWER_WIDTH,
					boxSizing: "border-box",

				},
			}}
		>
			<Toolbar
				sx={{
					padding: [1],
					display: "flex",
					alignItems: "center",
				}}
			>
				<Box >
					<img src={logo} height="40" alt="Modes" />
				</Box>
				<Box sx={{ flex: 1 }}>
					<Typography align="center" variant="h6">Modes</Typography>
				</Box>
				<IconButton onClick={onClose}>
					<ChevronLeftIcon />
				</IconButton>
			</Toolbar>
			<Divider />
			<List
				sx={{
					flex: 1,
				}}
			>
				{children}
			</List>
			<Divider />
			<Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
				<Typography
					sx={{ color: "text.secondary" }}
					variant="caption"
					noWrap
				>
					&copy; Zum roten Tuch {new Date().getFullYear()}
				</Typography>
			</Box>
		</Drawer>
	</Box>
)};
