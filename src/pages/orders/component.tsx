import { Fragment } from "react";
import type { FC } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridRowParams } from "@mui/x-data-grid";

import { t } from "i18n";
import { useRedirectEffect } from "hooks";
import { Result } from "components/result";
import { Search } from "components/search";
import { SplitButton } from "components/split-button";
import { Presenter } from "presentation/orders";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { filteredOrders, paymentTypeLabels },
		actions: {
			deleteOrder,
			updateOrder,
			createOrder,
			clearOrders,
			exportOrders,
		},
	} = presenter;

	useRedirectEffect(presenter, (page) => {
		switch (page.name) {
			case "clear":
				return `/orders/clear`;
			case "export":
				return `/orders/export`;
			case "create":
				return `/orders/create`;
			case "update":
				return `/orders/update/${page.orderId}`;
			case "delete":
				return `/orders/delete/${page.orderId}`;
			default:
		}
	});

	return (
		<Fragment>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography sx={{ flex: 1 }} variant="h5">
					{t("Orders")}
				</Typography>

				<SplitButton
					options={[
						{ label: t("Create"), handler: createOrder },
						{ label: t("Export"), handler: exportOrders },
						{ label: t("Clear"), handler: clearOrders },
					]}
				/>
			</Box>

			<Search presenter={presenter.searchPresenter} />

			<Result
				result={filteredOrders}
				failure={(result) => (
					<Alert severity="error">{result.error.message}</Alert>
				)}
				loading={<CircularProgress />}
			>
				{(result) => (
					<Box
						sx={{
							height: 525,
							display: "flex",
							backgroundColor: "white",
						}}
					>
						<Box sx={{ flex: 1 }}>
							<DataGrid
								rows={result.value}
								columns={[
									{
										field: "productId",
										headerName: t("SKU"),
									},
									{
										field: "name",
										headerName: t("Name"),
										flex: 1,
										valueFormatter: ({ value }) =>
											value || t("n/a"),
									},
									{
										field: "size",
										headerName: t("Size"),
										align: "center",
										headerAlign: "center",
									},
									{
										field: "quantity",
										align: "center",
										headerAlign: "center",
										headerName: t("Quantity"),
									},
									{
										field: "price",
										align: "center",
										headerAlign: "center",
										headerName: t("Price"),
										valueFormatter: ({ value }) =>
											typeof value === "number"
												? new Intl.NumberFormat(
														"de-DE",
														{
															currency: "EUR",
															style: "currency",
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														}
												  ).format(value)
												: "",
									},
									{
										field: "size",
										align: "center",
										headerAlign: "center",
										headerName: t("Size"),
									},

									{
										field: "paymentType",
										align: "center",
										headerAlign: "center",
										headerName: t("Payment type"),
										valueFormatter: ({ value }) =>
											typeof value === "string"
												? paymentTypeLabels[value]
												: "",
									},
									{
										field: "orderNr",
										align: "center",
										headerAlign: "center",
										headerName: t("Order number"),
										valueFormatter: ({ value }) =>
											value || t("n/a"),
									},
									{
										field: "actions",
										type: "actions",
										sortable: false,
										align: "center",
										headerAlign: "center",
										headerName: t("Actions"),
										getActions: (params: GridRowParams) => [
											<GridActionsCellItem
												icon={<EditIcon />}
												label={t("Edit")}
												onClick={() =>
													updateOrder(params.row.id)
												}
											/>,
											<GridActionsCellItem
												icon={<DeleteIcon />}
												label={t("Delete")}
												onClick={() =>
													deleteOrder(params.row.id)
												}
											/>,
										],
									},
								]}
							/>
						</Box>
					</Box>
				)}
			</Result>
		</Fragment>
	);
};
