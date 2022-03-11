import { Result } from "utils";
import type { Success, Failure } from "utils";

import type { OrderRepository, ProductRepository } from "../../repositories";
import type { ComposedOrder, Product } from "../../models";

import type { UseCase } from "../types";

type Input = void;
type Output = Promise<Success<ComposedOrder[]> | Failure<Error>>;

export class GetComposedOrdersUseCase implements UseCase<Input, Output> {
	constructor(
		private orderRepository: OrderRepository,
		private productRepository: ProductRepository
	) {}

	public async execute() {
		const ordersResult = await this.orderRepository.all();
		if (Result.isFailure(ordersResult)) {
			return ordersResult;
		}

		const productsResult = await this.productRepository.all();
		if (Result.isFailure(productsResult)) {
			return productsResult;
		}

		const products = productsResult.value.reduce((map, product) => {
			map.set(product.id, product);
			return map;
		}, new Map<string, Product>());

		const orders = ordersResult.value
			.map((order) => {
				const product = products.get(order.productId);
				if (product === undefined) {
					return null;
				}

				const { name, price, taxRate } = product;

				return {
					...order,
					name,
					price,
					taxRate,
					toString: () =>
						`${product.id} | ${name} | ${order.paymentType} | ${order.orderNumber}`,
				};
			})
			.filter(
				(order: ComposedOrder | null): order is ComposedOrder =>
					order !== null
			);

		return Result.success(orders);
	}
}
