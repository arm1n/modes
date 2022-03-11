import type { FC, ReactNode } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { t } from "i18n";

type Props = {
	title: string;
	isBusy: boolean;
	onSave: () => void;
	onCancel: () => void;
	confirm?: ReactNode;
};

export const Component: FC<Props> = ({
	title,
	isBusy,
	onCancel,
	onSave,
	children,
	confirm = t("Confirm")
}) => (
	<Dialog
		open={true}
		fullScreen={true}
		onClose={onCancel}
	>
		<DialogTitle>{title}</DialogTitle>
		<DialogContent dividers={true}>{children}</DialogContent>
		<DialogActions>
			<Button onClick={onCancel} variant="text">
				{t("Cancel")}
			</Button>
			<Button
				onClick={onSave}
				variant="contained"
				disableElevation={true}
				disabled={isBusy}
			>
				{confirm}
			</Button>
		</DialogActions>
	</Dialog>
);
