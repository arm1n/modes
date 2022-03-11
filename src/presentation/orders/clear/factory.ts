import type { ClearOrdersUseCase } from "domain/use-cases/order";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";

export class OrdersClearPresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly clearOrdersUseCase: ClearOrdersUseCase,
	) {}

	public create() {
		return new Presenter(this.clearOrdersUseCase);
	}
}
