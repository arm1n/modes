import { t } from "i18n";
import { Result } from "utils";
import type { ClearProductsUseCase } from "domain/use-cases/product";

import { BasePresenter } from "../../base";
import type {
	ActionPresenter,
	RedirectToPageEffect,
	NotificationEffect,
} from "../../types";

type State = {
	isBusy: boolean;
};
type Effects = RedirectToPageEffect<"products"> & NotificationEffect;
type Actions = {
	save: () => void;
	cancel: () => void;
};

const INITIAL_STATE = {
	isBusy: false,
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	constructor(private readonly clearProductsUseCase: ClearProductsUseCase) {
		super(INITIAL_STATE);
	}

	public get actions() {
		return {
			save: this.save.bind(this),
			cancel: this.cancel.bind(this),
		};
	}

	private async save() {
		this.dispatchState({ isBusy: true });

		const result = await this.clearProductsUseCase.execute();

		this.dispatchState({ isBusy: false });

		if (Result.isSuccess(result)) {
			this.dispatchEffect({
				name: "showNotification",
				data: Result.success({
					message: t("Products have been successfully deleted."),
				}),
			});

			this.dispatchEffect({
				name: "redirectToPage",
				data: {
					page: "products",
				},
			});

			return;
		}

		this.dispatchEffect({
			name: "showNotification",
			data: result,
		});
	}

	protected cancel() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: { page: "products" },
		});
	}
}
