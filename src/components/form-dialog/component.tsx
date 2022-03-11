import { Fragment, forwardRef } from "react";
import type { FC, ReactNode } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { t } from "i18n";

const Transition = forwardRef(
	(
		props: TransitionProps & {
			children: React.ReactElement;
		},
		ref: React.Ref<unknown>
	) => <Slide direction="up" ref={ref} {...props} />
);

type Props = {
	title: string;
	loading: string;
	isValid: boolean;
	isBusy: boolean;
	onSave: () => void;
	onCancel: () => void;
	save?: ReactNode;
};

export const Component: FC<Props> = ({
	title,
	loading,
	isValid,
	isBusy,
	onCancel,
	onSave,
	children,
	save = t("Save")
}) => (
	<Fragment>
		<Dialog
			open={true}
			fullScreen={true}
			onClose={onCancel}
			TransitionComponent={Transition}
		>
			<AppBar elevation={0} sx={{ position: "relative" }}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="close"
						onClick={onCancel}
					>
						<CloseIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ ml: 2, flex: 1 }}
					>
						{title}
					</Typography>
					<Button
						autoFocus={true}
						color="inherit"
						onClick={onSave}
						disabled={!isValid || isBusy}
					>
						{save}
					</Button>
				</Toolbar>
			</AppBar>

			<DialogContent>
				<Box
					component="form"
					noValidate={true}
					autoComplete="off"
				>
					{children}
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onCancel} variant="text">
					{t("Cancel")}
				</Button>
				<Button
					onClick={onSave}
					variant="contained"
					disableElevation={true}
					disabled={!isValid || isBusy}
				>
					{save}
				</Button>
			</DialogActions>
		</Dialog>

		<Backdrop
			sx={{
				zIndex: 9999,
				color: "white",
				display: "flex",
				flexDirection: "column",
			}}
			open={isBusy}
		>
			<CircularProgress color="inherit" />
			<Typography sx={{ mt: 2 }}>{loading}</Typography>
		</Backdrop>
	</Fragment>
);
