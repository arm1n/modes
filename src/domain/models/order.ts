import type { KeysWithoutFunctions } from "types";

import type { Model } from "./types";
import type { Data as ProductData } from "./product";

export type Data = Pick<Order, KeysWithoutFunctions<Order>>;

export class Order implements Model {
	constructor(props: Data) {
		this.id = props.id;
		this.productId = props.productId;
		this.quantity = props.quantity;
		this.size = props.size;
		this.paymentType = props.paymentType;
		this.orderNumber = props.orderNumber;
	}

	public id: string;
	public productId: string;
	public quantity: number;
	public size: number;
	public paymentType: string;
	public orderNumber: string;

	public toString() {
		return `${this.id} | ${this.productId} | ${this.size} | ${this.paymentType} | ${this.orderNumber}`;
	}
}

export type ComposedOrder = Data &
	Pick<ProductData, "name" | "price" | "taxRate">;
