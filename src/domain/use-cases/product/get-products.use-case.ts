import type { ProductRepository } from "../../repositories";

import type { UseCase } from "../types";

type Input = void;
type Output = ReturnType<ProductRepository["all"]>;

export class GetProductsUseCase implements UseCase<Input, Output> {
	constructor(private productRepository: ProductRepository) {}

	public execute() {
		return this.productRepository.all();
	}
}
