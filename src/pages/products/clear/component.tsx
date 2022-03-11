import type { FC } from "react";

import { t } from "i18n";
import { useRedirectEffect, useNotificationEffect } from "hooks";
import { ConfirmDialog } from "components/confirm-dialog";
import { Presenter } from "presentation/products/clear";

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
			case "products":
				return "/products";
			default:
		}
	});

	return (
		<ConfirmDialog
			title={t("Clear products")}
			isBusy={isBusy}
			onSave={save}
			onCancel={cancel}
			confirm={t("Delete")}
		>
			{t("Do you really want to clear all products?")}
		</ConfirmDialog>
	);
};
