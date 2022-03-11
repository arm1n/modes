import type { FC } from "react";

import { t } from "i18n";
import { useRedirectEffect, useNotificationEffect } from "hooks";
import { ConfirmDialog } from "components/confirm-dialog";
import { Presenter } from "presentation/orders/delete";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { isBusy },
		actions: { save, cancel }
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
		<ConfirmDialog
			title={t("Delete order")}
			isBusy={isBusy}
			onSave={save}
			onCancel={cancel}
		>
			{t("Do you really want to delete this order?")}
		</ConfirmDialog>
	);
};
