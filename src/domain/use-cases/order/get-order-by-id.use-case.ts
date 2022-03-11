import type { OrderRepository } from "../../repositories";
import type { OrderData } from "../../models";

import type { UseCase } from "../types";

type Input = Pick<OrderData, 'id'>;
type Output = ReturnType<OrderRepository["get"]>;

export class GetOrderByIdUseCase implements UseCase<Input, Output> {
	constructor(private orderRepository: OrderRepository) {}

	public execute({ id }: Input) {
		return this.orderRepository.get(id);
	}
}
