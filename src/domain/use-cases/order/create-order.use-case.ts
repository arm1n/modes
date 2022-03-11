import type { OrderRepository } from "../../repositories";
import type { OrderData } from "../../models";
import { Order } from "../../models";

import type { UseCase } from "../types";

type Input = Omit<OrderData, "id">;
type Output = ReturnType<OrderRepository["persist"]>;

export class CreateOrderUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute(input: Input) {
		const order = new Order({
			...input,
			id: `order.${Date.now()}`,
		});

		return this.orderRepository.persist(order);
	}
}
