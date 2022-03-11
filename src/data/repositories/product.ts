import { Product } from "domain/models";
import type { ProductData } from "domain/models";

import type { Database } from "../databases";
import type { Mapper } from "../mappers";

import { Base } from "./base";

export class ProductRepository extends Base<Product, ProductData> {
	constructor(
		protected database: Database,
		protected mapper: Mapper<Product, ProductData>
	) {
		super(database, mapper, Product);
	}
}
