import type { ExportOrdersUseCase } from "domain/use-cases/order";

import type { Factory } from "../../types";

import { Presenter } from "./presenter";

export class OrdersExportPresenterFactory implements Factory<Presenter> {
	constructor(
		private readonly exportOrdersUseCase: ExportOrdersUseCase,
	) {}

	public create() {
		return new Presenter(this.exportOrdersUseCase);
	}
}
