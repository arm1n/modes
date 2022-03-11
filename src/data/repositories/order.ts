import { Order } from "domain/models";
import type { OrderData } from "domain/models";

import type { Database } from "../databases";
import type { Mapper } from "../mappers";

import { Base } from "./base";

export class OrderRepository extends Base<Order, OrderData> {
	constructor(
		protected database: Database,
		protected mapper: Mapper<Order, OrderData>
	) {
		super(database, mapper, Order);
	}
}
