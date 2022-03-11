import { t } from "i18n";
import { Result } from "utils";

import type {
	GetOrderByIdUseCase,
	UpdateOrderUseCase,
} from "domain/use-cases/order";

import { OrdersFormPresenterFactory } from "presentation/orders/form";

import { WritePresenter } from "../write";

export type RuntimeData = {
	orderId?: string;
	productId?: string;
};

export class Presenter extends WritePresenter {
	constructor(
		ordersFormPresenterFactory: OrdersFormPresenterFactory,
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly updateOrderUseCase: UpdateOrderUseCase,
		protected readonly runtimeData: RuntimeData
	) {
		super(ordersFormPresenterFactory);
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

		const { productId, ...order } = result.value;
		const product = this.formPresenter.actions.getProductById(productId);

		this.formPresenter.providers.setFields({
			...order,
			product,
		});
	}

	protected isSaveable() {
		return this.getOrderData() !== null;
	}

	protected async performSave() {
		const orderData = this.getOrderData();

		if (orderData === null) {
			return Result.failure(new Error(t("Invalid order data!")));
		}

		return await this.updateOrderUseCase.execute(orderData);
	}

	private getOrderData():
		| Parameters<UpdateOrderUseCase["execute"]>[0]
		| null {
		const {
			fields: { product, size, quantity, paymentType, orderNumber },
		} = this.formPresenter.state;

		if (product === null || this.runtimeData.orderId === undefined) {
			return null;
		}

		const { id: productId } = product;
		const { orderId: id } = this.runtimeData;

		return { id, productId, quantity, size, paymentType, orderNumber };
	}
}
