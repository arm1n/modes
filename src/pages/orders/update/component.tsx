import type { FC } from "react";

import { t } from "i18n";
import { useRedirectEffect, useNotificationEffect } from "hooks";
import { FormDialog } from "components/form-dialog";
import { Presenter } from "presentation/orders/update";

import { OrdersForm } from "../form";

type Props = {
	presenter: Presenter;
};

export const Component: FC<Props> = ({ presenter }) => {
	const {
		state: { isValid, isBusy },
		actions: { save, cancel },
		formPresenter
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
			title={t("Create order")}
			loading={t("Creating order...")}
			isValid={isValid}
			isBusy={isBusy}
			onSave={save}
			onCancel={cancel}
		>
			<OrdersForm presenter={formPresenter} />
		</FormDialog>
	);
};
