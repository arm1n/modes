import type { OrderRepository } from "../../repositories";
import type { Order } from "../../models";

import type { UseCase } from "../types";

type Input = Order;
type Output = ReturnType<OrderRepository["remove"]>;

export class DeleteOrderUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute(input: Input) {
		return this.orderRepository.remove(input);
	}
}
