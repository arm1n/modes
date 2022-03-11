import { t } from "i18n";
import { Result } from "utils";
import type { CreateOrderUseCase } from "domain/use-cases/order";

import { OrdersFormPresenterFactory } from "presentation/orders/form";

import { WritePresenter } from "../write";

export type RuntimeData = {
	productId?: string;
};

export class Presenter extends WritePresenter {
	constructor(
		ordersFormPresenterFactory: OrdersFormPresenterFactory,
		private readonly createOrderUseCase: CreateOrderUseCase,
		protected readonly runtimeData: RuntimeData = {
			productId: undefined,
		}
	) {
		super(ordersFormPresenterFactory, runtimeData);
	}

	protected isSaveable() {
		return this.getOrderData() !== null;
	}

	protected async performSave() {
		const orderData = this.getOrderData();

		if (orderData === null) {
			return Result.failure(new Error(t("Invalid order data!")));
		}

		return await this.createOrderUseCase.execute(orderData);
	}

	private getOrderData():
		| Parameters<CreateOrderUseCase["execute"]>[0]
		| null {
		const {
			fields: { product, size, quantity, paymentType, orderNumber },
		} = this.formPresenter.state;

		if (product === null) {
			return null;
		}

		const { id: productId } = product;

		return { productId, quantity, size, paymentType, orderNumber };
	}
}
