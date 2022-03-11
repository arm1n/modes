import type { GetProductsUseCase } from "domain/use-cases/product";

import type { Factory } from "../types";
import type { SearchPresenterFactory } from "../search";

import { Presenter } from "./presenter";

export class ProductsPresenterFactory implements Factory<Presenter> {
	constructor(
		private getProductsUseCase: GetProductsUseCase,
		private searchPresenterFactory: SearchPresenterFactory
	) {}

	public create() {
		return new Presenter(
			this.getProductsUseCase,
			this.searchPresenterFactory
		);
	}
}
