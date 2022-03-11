import type { ClearProductsUseCase } from "domain/use-cases/product";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";

export class ProductsClearPresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly clearProductsUseCase: ClearProductsUseCase,
	) {}

	public create() {
		return new Presenter(this.clearProductsUseCase);
	}
}
