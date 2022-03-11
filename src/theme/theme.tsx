import { useMemo, useEffect, useState } from "react";
import type { ReactNode, FunctionComponent } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue } from "@mui/material/colors";
import { deDE as coreDeDE } from "@mui/material/locale";
import { deDE as gridDeDE } from "@mui/x-data-grid";
import "@mui/x-data-grid/themeAugmentation"; // note: for `createTheme()`
import type { LinkProps } from "@mui/material/Link";
import type { ListItemButtonProps } from "@mui/material/ListItemButton";
import type { CardActionAreaProps } from "@mui/material/CardActionArea";

import { StyledAppBar } from "./app-bar";
import { StyledDrawer } from "./drawer";
import { StyledContent } from "./content";

type Props = {
	currentPage: string;
	children: ReactNode;
	menuItems: ReactNode[];
	linkDecorator?: FunctionComponent<any>;
};

export const Theme = ({
	menuItems,
	currentPage,
	linkDecorator: LinkDecorator,
	children,
}: Props) => {
	const [isOpen, setIsOpened] = useState(true);
	const theme = useMemo(
		() =>
			createTheme(
				{
					palette: {
						primary: red,
						secondary: blue,
					},

					components: {
						MuiLink: {
							defaultProps: {
								component: LinkDecorator,
							} as LinkProps,
						},

						MuiListItemButton: {
							defaultProps: {
								component: LinkDecorator,
							} as ListItemButtonProps,
						},
						MuiButtonBase: {
							defaultProps: {
								LinkComponent: LinkDecorator,
							},
						},
						MuiCardActionArea: {
							defaultProps: {
								component: LinkDecorator
							} as CardActionAreaProps
						},
						MuiDataGrid: {
							defaultProps: {
								disableColumnMenu: true,
								disableSelectionOnClick: true
							},
							styleOverrides: {
								root: {
									"& .MuiDataGrid-columnSeparator": {
										display: "none",
									},
									"& .MuiDataGrid-columnHeader:focus": {
										outline: "none",
									},
									"& .MuiDataGrid-columnHeader:focus-within": {
										outline: "none",
									},
									"& .MuiDataGrid-cell:focus-within": {
										outline: "none",
									},
									"& .MuiDataGrid-cell:focus": {
										outline: "none",
									},
								},
								columnSeparator: {
									display: "none",
								},
							},
						},
					},
				},
				coreDeDE,
				gridDeDE
			),
		[LinkDecorator]
	);
	const isMD = useMediaQuery(theme.breakpoints.up("md"));

	useEffect(() => {
		// close drawer when we change from to > SM
		// close drawer when we change page in < SM
		setIsOpened(isMD);
	}, [isMD, currentPage]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<StyledAppBar isOpen={isOpen} onOpen={() => setIsOpened(true)} />
			<StyledDrawer isOpen={isOpen} onClose={() => setIsOpened(false)}>
				{menuItems}
			</StyledDrawer>
			<StyledContent isOpen={isOpen}>{children}</StyledContent>
		</ThemeProvider>
	);
};
