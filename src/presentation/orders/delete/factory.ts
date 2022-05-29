import type {
	GetOrderByIdUseCase,
	DeleteOrderUseCase,
} from "domain/use-cases/order";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";
import type { RuntimeData } from "./presenter";

export class OrdersDeletePresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
		private readonly deleteOrderUseCase: DeleteOrderUseCase
	) {}

	public create(runtimeData: RuntimeData) {
		return new Presenter(
			this.getOrderByIdUseCase,
			this.deleteOrderUseCase,
			runtimeData
		);
	}
}
