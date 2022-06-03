import { Fragment } from "react";
import type { FC } from "react";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

import { t } from "i18n";
import { usePresenter } from "hooks";
import { Presenter } from "presentation/orders/form";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: {
			fields: { product, size, quantity, paymentType, orderNumber },
			products,
			sizes,
			paymentTypes,
			validations,
		},
		actions: {
			changeProductHandler,
			changeSizeHandler,
			changeQuantityHandler,
			changePaymentTypeHandler,
			changeOrderNumberHandler,
		},
	} = presenter;

	usePresenter(presenter);

	return (
		<Fragment>
			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.product}
				disabled={true}
				variant="standard"
			>
				<Autocomplete
					id="product"
					sx={{ width: "100%" }}
					options={products}
					
					autoHighlight={true}
					getOptionLabel={(option) => option.toString()}
					value={product}
					onChange={(event, value) => changeProductHandler(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							autoFocus={true}
							label={t("Product")}
							variant="standard"
						/>
					)}
					componentsProps={{
						paper: {
							elevation: 1,
						},
					}}
				/>
				<FormHelperText error={true}>
					{validations.product}
				</FormHelperText>
			</FormControl>

			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.size}
				disabled={false}
				variant="standard"
			>
				<InputLabel id="size">{t("Size")}</InputLabel>
				<Select
					labelId="size"
					value={size}
					label={t("Size")}
					disabled={!sizes.length}
					onChange={(event) => {
						const number =
							typeof event.target.value === "string"
								? parseInt(event.target.value)
								: event.target.value;

						if (!isNaN(number)) {
							changeSizeHandler(number);
						}
					}}
					MenuProps={{
						elevation: 1,
					}}
				>
					{sizes.map((size) => (
						<MenuItem key={size} value={size}>
							{size}
						</MenuItem>
					))}
				</Select>

				<FormHelperText error={true}>{validations.size}</FormHelperText>
			</FormControl>

			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.quantity}
				disabled={false}
				variant="standard"
			>
				<InputLabel htmlFor="quantity">{t("Quantity")}</InputLabel>
				<Input
					id="quantity"
					type="number"
					value={quantity}
					onChange={(event) => {
						const number = parseInt(event.target.value);
						if (!isNaN(number)) {
							changeQuantityHandler(number);
						}
					}}
				/>
				<FormHelperText error={true}>
					{validations.quantity}
				</FormHelperText>
			</FormControl>

			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.paymentType}
				disabled={false}
				variant="standard"
			>
				<InputLabel id="paymentType">{t("Payment type")}</InputLabel>
				<Select
					labelId="paymentType"
					value={paymentType}
					label={t("Payment type")}
					onChange={(event) =>
						changePaymentTypeHandler(event.target.value)
					}
					MenuProps={{
						elevation: 1,
					}}
				>
					{paymentTypes.map(({ label, value }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</Select>

				<FormHelperText error={true}>
					{validations.product}
				</FormHelperText>
			</FormControl>

			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.orderNumber}
				disabled={false}
				variant="standard"
			>
				<InputLabel htmlFor="orderNumber">
					{t("Order number")}
				</InputLabel>
				<Input
					id="orderNumber"
					value={orderNumber}
					onChange={(event) =>
						changeOrderNumberHandler(event.target.value)
					}
				/>
				<FormHelperText error={true}>
					{validations.orderNumber}
				</FormHelperText>
			</FormControl>
		</Fragment>
	);
};
