import type { OrderRepository } from "../../repositories";

import type { UseCase } from "../types";

type Input = void;
type Output = ReturnType<OrderRepository["all"]>;

export class GetOrdersUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute() {
		return this.orderRepository.all();
	}
}
