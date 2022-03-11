import { Fragment } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCartOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { t } from "i18n";

const ITEMS = [
	{
		href: "/orders/create",
		label: t("Create order"),
		icon: <AddShoppingCartIcon fontSize="large" />,
	},
	{
		href: "/products/import",
		label: t("Import products"),
		icon: <FileUploadOutlinedIcon fontSize="large" />,
	},
	{
		href: "/orders/export",
		label: t("Export orders"),
		icon: <FileDownloadOutlinedIcon fontSize="large" />,
	},
	{
		href: "/products/clear",
		label: t("Clear products"),
		icon: <DeleteOutlinedIcon fontSize="large" />,
	},
	{
		href: "/orders/clear",
		label: t("Clear orders"),
		icon: <DeleteOutlinedIcon fontSize="large" />,
	},
];

export const Component = () => {
	return (
		<Fragment>
			<Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
				<Typography sx={{ flex: 1 }} variant="h5">
					{t("Dashboard")}
				</Typography>
			</Box>

			<Grid container={true} spacing={{ xs: 2, sm: 3, md: 5 }}>
				{ITEMS.map(({ href, icon, label }, index) => (
					<Grid item={true} xs={12} sm={6} md={4} key={index}>
						<Card variant="outlined">
							<CardActionArea href={href}>
								<CardContent>
									<Box
										sx={{
											minHeight: 150,
											display: "flex",
											alignItems: "center",
											flexDirection: "column",
											justifyContent: "center",
										}}
									>
										<Box sx={{ mb: 2 }}>
											<Avatar
												sx={{ width: 56, height: 56 }}
											>
												{icon}
											</Avatar>
										</Box>
										<Typography
											variant="h6"
											component="div"
											gutterBottom={true}
											sx={{ textAlign: "center" }}
										>
											{label}
										</Typography>
									</Box>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
		</Fragment>
	);
};
