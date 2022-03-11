import type { FC } from "react";

import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";

import { t } from "i18n";
import { FormDialog } from "components/form-dialog";
import { useRedirectEffect, useNotificationEffect } from "hooks";
import { Presenter } from "presentation/products/import";

import styles from "./component.module.scss";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { fields, delimiters, isValid, validations, isBusy },
		actions: { save, cancel, changeDelimiterHandler, changeFileHandler },
	} = presenter;

	useNotificationEffect(presenter);
	useRedirectEffect(presenter, (page) => {
		switch (page) {
			case "products":
				return "/products";
			default:
		}
	});

	return (
		<FormDialog
			onSave={save}
			onCancel={cancel}
			isValid={isValid}
			isBusy={isBusy}
			title={t("Import products")}
			loading={t("Importing products...")}
		>
			<FormControl
				sx={{ mb: 2 }}
				fullWidth={true}
				variant="standard"
			>
				<InputLabel id="delimiter-select">{t("Delimiter")}</InputLabel>
				<Select
					value={fields.delimiter}
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
				sx={{ mb: 2 }}
				fullWidth={true}
				error={!!validations.file}
				disabled={true}
				variant="standard"
			>
				<InputLabel htmlFor="file">{t("File")}</InputLabel>
				<Input id="file" value={fields.file?.name || ""} />
				<FormHelperText error={true}>{validations.file}</FormHelperText>
			</FormControl>

			<FormControl>
				<label htmlFor="file-input">
					<input
						type="file"
						accept=".csv"
						id="file-input"
						className={styles.file}
						onChange={(event) => changeFileHandler(event.target.files)}
					/>
					<Button variant="outlined" component="span">
						{t("Select file")}
					</Button>
				</label>
			</FormControl>
		</FormDialog>
	);
};
