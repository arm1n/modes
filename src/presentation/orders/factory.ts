import type { GetComposedOrdersUseCase } from "domain/use-cases/order";
import type { GetProductsUseCase } from "domain/use-cases/product";

import type { Factory } from "../types";
import type { SearchPresenterFactory } from "../search";

import { Presenter } from "./presenter";

export class OrdersPresenterFactory implements Factory<Presenter> {
	constructor(
		private getComposedOrdersUseCase: GetComposedOrdersUseCase,
		private getProductsUseCase: GetProductsUseCase,
		private searchPresenterFactory: SearchPresenterFactory
	) {}

	public create() {
		return new Presenter(
			this.getComposedOrdersUseCase,
			this.getProductsUseCase,
			this.searchPresenterFactory
		);
	}
}
