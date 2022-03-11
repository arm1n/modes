import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

import { t } from "i18n";

import { DRAWER_WIDTH, NAVBAR_HEIGHT } from "./constants";

type Props = {
	isOpen: boolean;
	onOpen: () => void;
};

export const StyledAppBar = ({ isOpen, onOpen }: Props) => {
	const theme = useTheme();

	return (
		<AppBar
			elevation={0}
			position="fixed"
			sx={{
				"& .MuiToolbar-root": {
					minHeight: [NAVBAR_HEIGHT],
				},
				marginLeft: isOpen ? `${DRAWER_WIDTH}px` : 0,
				width: isOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
				transition: theme.transitions.create(["margin", "width"], {
					easing: isOpen
						? theme.transitions.easing.easeOut
						: theme.transitions.easing.sharp,
					duration: isOpen
						? theme.transitions.duration.enteringScreen
						: theme.transitions.duration.leavingScreen,
				}),
			}}
		>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					onClick={onOpen}
					sx={{
						marginRight: 1,
						alignItems: "center",
						display: isOpen ? "none" : "flex",
					}}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					sx={{ fontWeight: "bold", flexGrow: 1 }}
					variant="button"
					noWrap
				>
					{t("Market management")}
				</Typography>
				<Button
					component="a"
					color="inherit"
					target="_blank"
					rel="noopener"
					href="https://www.q-bon.at"
				>
					Q-Bon
				</Button>
			</Toolbar>
		</AppBar>
	);
};
