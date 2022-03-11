import type { OrderRepository } from "../../repositories";

import type { UseCase } from "../types";

type Input = void;
type Output = ReturnType<OrderRepository["clear"]>;

export class ClearOrdersUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute() {
		return this.orderRepository.clear();
	}
}
