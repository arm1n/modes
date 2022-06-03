import { t } from "i18n";
import { Result } from "utils";
import type { Loading, Success, Failure, Subscription } from "utils";

import type { GetComposedOrdersUseCase } from "domain/use-cases/order";
import type { GetProductsUseCase } from "domain/use-cases/product";
import type { ComposedOrder } from "domain/models";
import { PAYMENT_TYPES } from "domain/enums";

import { BasePresenter } from "../base";
import type { ActionPresenter, RedirectToPageEffect } from "../types";
import type {
	SearchPresenterFactory,
	Presenter as SearchPresenter,
} from "../search";

type State = {
	loadedOrders: Loading | Success<ComposedOrder[]> | Failure<Error>;
	filteredOrders: Loading | Success<ComposedOrder[]> | Failure<Error>;
	paymentTypeLabels: Record<string, string>;
};
type Effects = RedirectToPageEffect<
	| { name: "update"; orderId: ComposedOrder["id"] }
	| { name: "delete"; orderId: ComposedOrder["id"] }
	| { name: "create" }
	| { name: "export" }
	| { name: "clear" }
>;
type Actions = {
	createOrder: () => void;
	clearOrders: () => void;
	exportOrders: () => void;
	updateOrder: (orderId: ComposedOrder["id"]) => void;
	deleteOrder: (orderId: ComposedOrder["id"]) => void;
};

const INITIAL_STATE = {
	loadedOrders: Result.loading(),
	filteredOrders: Result.loading(),
	paymentTypeLabels: {
		[PAYMENT_TYPES.DEBIT_CARD]: t("DEBIT_CARD"),
		[PAYMENT_TYPES.CASH]: t("CASH"),
	},
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	public searchPresenter: SearchPresenter<ComposedOrder>;
	private searchSubscription: Subscription | null = null;

	constructor(
		private readonly getComposedOrdersUseCase: GetComposedOrdersUseCase,
		private readonly getProductsUseCase: GetProductsUseCase,
		searchPresenterFactory: SearchPresenterFactory
	) {
		super(INITIAL_STATE);

		this.searchPresenter = searchPresenterFactory.create();
	}

	public async onInit() {
		await this.loadOrders();

		this.searchSubscription = this.searchPresenter.effects$.subscribe({
			update: ({ name, data }) => {
				switch (name) {
					case "onFiltered":
						this.dispatchState({
							filteredOrders: data,
						});
						break;
					default:
				}
			},
		});
	}

	public onDispose() {
		this.searchSubscription?.unsubscribe();
	}

	public get actions() {
		return {
			exportOrders: this.exportOrders.bind(this),
			createOrder: this.createOrder.bind(this),
			clearOrders: this.clearOrders.bind(this),
			updateOrder: this.updateOrder.bind(this),
			deleteOrder: this.deleteOrder.bind(this),
		};
	}

	private async loadOrders() {
		this.dispatchState({
			loadedOrders: Result.loading(),
			filteredOrders: Result.loading(),
		});

		const result = await this.getComposedOrdersUseCase.execute();
		const orders = Result.isFailure(result)
			? Result.failure(new Error(t("Could not load orders!")))
			: result;

		if (Result.isSuccess(orders)) {
			orders.value.sort((a, b) =>
				b.id.localeCompare(a.id, undefined, {
					sensitivity: "base",
					numeric: true,
				})
			);
		}

		this.searchPresenter.providers.setCollection(orders);

		this.dispatchState({
			loadedOrders: orders,
			filteredOrders: orders,
		});
	}

	private createOrder() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "create",
				},
			},
		});
	}

	private exportOrders() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "export",
				},
			},
		});
	}

	private clearOrders() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "clear",
				},
			},
		});
	}

	private updateOrder(orderId: ComposedOrder["id"]) {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "update",
					orderId,
				},
			},
		});
	}

	private deleteOrder(orderId: ComposedOrder["id"]) {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "delete",
					orderId,
				},
			},
		});
	}
}
