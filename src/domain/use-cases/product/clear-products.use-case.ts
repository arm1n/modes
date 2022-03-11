import type { ProductRepository } from "../../repositories";

import type { UseCase } from "../types";

type Input = void;
type Output = ReturnType<ProductRepository["clear"]>;

export class ClearProductsUseCase implements UseCase<Input, Output> {
	constructor(private productRepository: ProductRepository) {}

	public execute() {
		return this.productRepository.clear();
	}
}
