import type { FC } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { t } from "i18n";
import { usePresenter } from "hooks";
import { Presenter } from "presentation/search";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { query },
		actions: { search, update },
	} = presenter;

	usePresenter(presenter);

	return (
		<Box
			sx={{ my: 2 }}
			component="form"
			noValidate={true}
			autoComplete="off"
		>
			<TextField
				value={query}
				type="search"
				autoFocus={true}
				fullWidth={true}
				variant="standard"
				label={t("Search")}
				onChange={({ target: { value } }) => {
					update(value);
					search();
				}}
			/>
		</Box>
	);
};
