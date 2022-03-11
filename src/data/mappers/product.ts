import { Product } from "domain/models";
import type { ProductData } from "domain/models";

import type { Mapper } from "./types";

export class ProductMapper implements Mapper<Product, ProductData> {
	public toData(model: Product) {
		const { id, name, price, taxRate, amounts, sizes, units, producer } =
			model;

		return {
			id,
			name,
			price,
			taxRate,
			amounts,
			sizes,
			units,
			producer,
		};
	}

	public toModel(data: ProductData) {
		return new Product(data);
	}
}
