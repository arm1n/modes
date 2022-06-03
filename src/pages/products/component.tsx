import { Fragment } from "react";
import type { FC } from "react";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridRowParams, GridRenderCellParams } from "@mui/x-data-grid";

import { t } from "i18n";
import { useRedirectEffect } from "hooks";
import { Result } from "components/result";
import { Search } from "components/search";
import { SplitButton } from "components/split-button";
import { Presenter } from "presentation/products";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { filteredProducts },
		actions: { clearProducts, importProducts, orderProduct },
	} = presenter;

	useRedirectEffect(presenter, (page) => {
		switch (page.name) {
			case "clear":
				return `/products/clear`;
			case "import":
				return `/products/import`;

			case "create-order":
				return `/orders/create?productId=${page.productId}`;
			default:
		}
	});

	return (
		<Fragment>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography sx={{ flex: 1 }} variant="h5">
					{t("Products")}
				</Typography>
				<SplitButton
					options={[
						{ label: t("Import"), handler: importProducts },
						{ label: t("Clear"), handler: clearProducts },
					]}
				/>
			</Box>

			<Search presenter={presenter.searchPresenter} />

			<Result
				result={filteredProducts}
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
										field: "id",
										headerName: t("SKU"),
									},
									{
										field: "name",
										headerName: t("Name"),
										flex: 0.5,
										valueFormatter: ({ value }) =>
											value || t("n/a"),
									},
									{
										field: "variation",
										flex: 0.5,
										headerName: `${t("Size")} (${t(
											"Amount"
										)})`,
										renderCell: ({
											row,
										}: GridRenderCellParams<
											unknown,
											typeof result.value[number]
										>) =>
											row.sizes
												.map(
													(size, index) =>
														`${size} (${row.amounts[index]})`
												)
												.sort()
												.join(", "),
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
										field: "taxRate",
										align: "center",
										headerAlign: "center",
										headerName: t("Tax"),
										valueFormatter: ({ value }) =>
											typeof value === "number"
												? new Intl.NumberFormat(
														"de-DE",
														{
															style: "percent",
															minimumFractionDigits: 2,
															maximumFractionDigits: 2,
														}
												  ).format(value)
												: "",
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
												icon={<AddShoppingCartIcon />}
												label={t("Order")}
												onClick={() =>
													orderProduct(params.row.id)
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
