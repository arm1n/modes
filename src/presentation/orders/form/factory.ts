import type { GetProductsUseCase } from "domain/use-cases/product";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";
import type { RuntimeData } from "./presenter";

export class OrdersFormPresenterFactory implements Factory<Presenter> {
	constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

	public create(runtimeData?: RuntimeData) {
		return new Presenter(this.getProductsUseCase, runtimeData);
	}
}
