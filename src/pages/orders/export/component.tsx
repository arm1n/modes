import type { FC } from "react";

import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";

import { t } from "i18n";
import { FormDialog } from "components/form-dialog";
import { useRedirectEffect, useNotificationEffect } from "hooks";
import { Presenter } from "presentation/orders/export";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { fields: { delimiter, columns }, isValid, isBusy, delimiters },
		actions: { save, cancel, changeColumnHandler, changeDelimiterHandler  },
	} = presenter;

	useNotificationEffect(presenter);
	useRedirectEffect(presenter, (page) => {
		switch (page) {
			case "orders":
				return "/orders";
			default:
		}
	});

	return (
		<FormDialog
			onSave={save}
			onCancel={cancel}
			isValid={isValid}
			isBusy={isBusy}
			save={"Export"}
			title={t("Export orders")}
			loading={t("Exporting orders...")}
		>

			<FormControl
				sx={{ mb: 5 }}
				fullWidth={true}
				variant="standard"
			>
				<InputLabel id="delimiter-select">{t("Delimiter")}</InputLabel>
				<Select
					value={delimiter}
					id="delimiter-select"
					labelId="delimiter-label"
					label={t("Delimiter")}
					onChange={(event) => changeDelimiterHandler(event.target.value)}
				>
					{delimiters.map(({ value, name }) => (
						<MenuItem key={value} value={value}>
							{name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl
				error={!isValid}
				component="fieldset"
				variant="standard"
			>
				<FormLabel focused={false} component="legend">
					{t("Columns to be exported")}
				</FormLabel>
				<FormGroup>
					<FormControlLabel
						label={t("SKU")}
						control={
							<Checkbox
								checked={columns.productId}
								onChange={(event) =>
									changeColumnHandler(
										"productId",
										event.target.checked
									)
								}
							/>
						}
					/>
					<FormControlLabel
						label={t("Quantity")}
						control={
							<Checkbox
								checked={columns.quantity}
								onChange={(event) =>
									changeColumnHandler(
										"quantity",
										event.target.checked
									)
								}
							/>
						}
					/>
					<FormControlLabel
						label={t("Price")}
						control={
							<Checkbox
								checked={columns.price}
								onChange={(event) =>
									changeColumnHandler("price", event.target.checked)
								}
							/>
						}
					/>
					<FormControlLabel
						label={t("Size")}
						control={
							<Checkbox
								checked={columns.size}
								onChange={(event) =>
									changeColumnHandler("size", event.target.checked)
								}
							/>
						}
					/>
					<FormControlLabel
						label={t("Payment type")}
						control={
							<Checkbox
								checked={columns.paymentType}
								onChange={(event) =>
									changeColumnHandler(
										"paymentType",
										event.target.checked
									)
								}
							/>
						}
					/>
					<FormControlLabel
						label={t("Order number")}
						control={
							<Checkbox
								checked={columns.orderNumber}
								onChange={(event) =>
									changeColumnHandler(
										"orderNumber",
										event.target.checked
									)
								}
							/>
						}
					/>
				</FormGroup>
				{!isValid && (
					<FormHelperText>
						{t("At least one column must be selected")}
					</FormHelperText>
				)}
			</FormControl>
		</FormDialog>
	);
};
