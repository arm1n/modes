import { t } from "i18n";
import { Result } from "utils";
import type { Success, Failure, Subscription } from "utils";

import {
	OrdersFormPresenterFactory,
	Presenter as OrdersFormPresenter,
} from "presentation/orders/form";

import { BasePresenter } from "../../base";
import type {
	ActionPresenter,
	RedirectToPageEffect,
	NotificationEffect,
} from "../../types";

type State = {
	isValid: boolean;
	isBusy: boolean;
};
type Effects = RedirectToPageEffect<"orders"> & NotificationEffect;
type Actions = {
	save: () => void;
	cancel: () => void;
};
export type RuntimeData = {
	productId?: string;
};

const INITIAL_STATE = {
	isBusy: false,
	isValid: false,
};

export abstract class WritePresenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	public formPresenter: OrdersFormPresenter;
	private formSubscription: Subscription | null = null;

	constructor(
		ordersFormPresenterFactory: OrdersFormPresenterFactory,
		protected readonly runtimeData: RuntimeData = {
			productId: undefined,
		}
	) {
		super(INITIAL_STATE);
		this.formPresenter = ordersFormPresenterFactory.create(runtimeData);
	}

	public async onInit() {
		this.formSubscription = this.formPresenter.effects$.subscribe({
			update: (effect) => {
				switch (effect.name) {
					case "onProductsFailure":
						this.dispatchEffect({
							name: "showNotification",
							data: effect.data,
						});
						break;

					case "onValidate":
						this.dispatchState({
							isValid: effect.data.isValid,
						});

						break;

					default:
				}
			},
		});
	}

	public onDispose() {
		this.formSubscription?.unsubscribe();
	}

	public get actions() {
		return {
			save: this.save.bind(this),
			cancel: this.cancel.bind(this),
		};
	}

	protected async save() {
		if (!this.isSaveable()) {
			return;
		}

		this.dispatchState({ isBusy: true });

		const result = await this.performSave();

		this.dispatchState({ isBusy: false });

		if (Result.isSuccess(result)) {
			this.dispatchEffect({
				name: "showNotification",
				data: Result.success({
					message: t("Order has been successfully saved."),
				}),
			});

			this.dispatchEffect({
				name: "redirectToPage",
				data: {
					page: "orders",
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
			data: { page: "orders" },
		});
	}

	protected abstract isSaveable(): boolean;
	protected abstract performSave(): Promise<Success<unknown, unknown> | Failure<Error, unknown>>;
}
