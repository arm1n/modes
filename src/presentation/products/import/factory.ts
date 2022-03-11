import type { ImportProductsUseCase } from "domain/use-cases/product";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";

export class ProductsImportPresenterFactory implements Factory<Presenter> {
	constructor(private importProductsUseCase: ImportProductsUseCase) {}

	public create() {
		return new Presenter(this.importProductsUseCase);
	}
}
