import { t } from "i18n";
import { Result } from "utils";
import type { Success, Failure, Loading } from "utils";

import type {
	GetOrderByIdUseCase,
	DeleteOrderUseCase,
} from "domain/use-cases/order";
import type { OrderData } from "domain/models";

import { BasePresenter } from "../../base";
import type {
	ActionPresenter,
	RedirectToPageEffect,
	NotificationEffect,
} from "../../types";

type State = {
	isBusy: boolean;
	order: Loading | Success<OrderData> | Failure<Error>;
};
type Effects = RedirectToPageEffect<"orders"> & NotificationEffect;
type Actions = {
	save: () => void;
	cancel: () => void;
};

export type RuntimeData = {
	orderId?: string;
};

const INITIAL_STATE = {
	isBusy: false,
	order: Result.loading(),
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	constructor(
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly deleteOrderUseCase: DeleteOrderUseCase,
		protected readonly runtimeData: RuntimeData
	) {
		super(INITIAL_STATE);
	}

	public async onInit() {
		await super.onInit();

		if (this.runtimeData.orderId === undefined) {
			return this.dispatchEffect({
				name: "redirectToPage",
				data: {
					page: "orders",
				},
			});
		}

		const result = await this.getOrderByIdUseCase.execute({
			id: this.runtimeData.orderId,
		});

		if (Result.isFailure(result) || result.value === null) {
			return this.dispatchEffect({
				name: "showNotification",
				data: Result.failure(new Error(t("Could not load order!"))),
			});
		}

		this.dispatchState({ order: Result.success(result.value) });
	}

	public get actions() {
		return {
			save: this.save.bind(this),
			cancel: this.cancel.bind(this),
		};
	}

	private async save() {
		if (!Result.isSuccess(this.state.order)) {
			return Result.failure(new Error(t("Invalid order data!")));
		}

		this.dispatchState({ isBusy: true });

		const result = await this.deleteOrderUseCase.execute(
			this.state.order.value
		);

		this.dispatchState({ isBusy: false });

		if (Result.isSuccess(result)) {
			this.dispatchEffect({
				name: "showNotification",
				data: Result.success({
					message: t("Order has been successfully deleted."),
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
}
