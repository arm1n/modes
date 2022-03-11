import { Order } from "domain/models";
import type { OrderData } from "domain/models";

import type { Mapper } from "./types";

export class OrderMapper implements Mapper<Order, OrderData> {
	public toData(model: Order) {
		const { id, productId, quantity, size, paymentType, orderNumber } = model;

		return {
			id,
			productId,
			quantity,
			size,
			paymentType,
			orderNumber,
		};
	}

	public toModel(data: OrderData) {
		return new Order(data);
	}
}
