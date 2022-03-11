import type { OrdersFormPresenterFactory } from "presentation/orders/form";
import type { CreateOrderUseCase } from "domain/use-cases/order";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";
import type { RuntimeData } from "./presenter";

export class OrdersCreatePresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly ordersFormPresenterFactory: OrdersFormPresenterFactory,
		private readonly createOrderUseCase: CreateOrderUseCase,
	) {}

	public create(runtimeData?: RuntimeData) {
		return new Presenter(this.ordersFormPresenterFactory, this.createOrderUseCase, runtimeData);
	}
}
