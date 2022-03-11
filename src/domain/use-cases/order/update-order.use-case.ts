import type { OrderRepository } from "../../repositories";
import type { OrderData } from "../../models";
import { Order } from "../../models";

import type { UseCase } from "../types";

type Input = OrderData;
type Output = ReturnType<OrderRepository["remove"]>;

export class UpdateOrderUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute(input: Input) {
		return this.orderRepository.persist(new Order(input));
	}
}
