import type { OrdersFormPresenterFactory } from "presentation/orders/form";
import type {
	GetOrderByIdUseCase,
	UpdateOrderUseCase,
} from "domain/use-cases/order";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";
import type { RuntimeData } from "./presenter";

export class OrdersUpdatePresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly ordersFormPresenterFactory: OrdersFormPresenterFactory,
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly updateOrderUseCase: UpdateOrderUseCase
	) {}

	public create(runtimeData: RuntimeData) {
		return new Presenter(
			this.ordersFormPresenterFactory,
			this.getOrderByIdUseCase,
			this.updateOrderUseCase,
			runtimeData
		);
	}
}
