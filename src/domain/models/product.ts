import type { KeysWithoutFunctions } from "types";

import type { Model } from "./types";

export type Data = Pick<Product, KeysWithoutFunctions<Product>>;

export class Product implements Model {
	constructor(props: Data) {
		this.id = props.id;
		this.name = props.name || "";
		this.price = props.price || 0;
		this.taxRate = props.taxRate || 0;
		this.producer = props.producer || "";
		this.units = props.units || [];
		this.sizes = props.sizes || [];
		this.amounts = props.amounts || [];
	}

	public id: string;
	public name: string;
	public price: number;
	public taxRate: number;
	public producer: string;
	public units: string[];
	public sizes: number[];
	public amounts: number[];

	public getVariations() {
		return this.sizes.map((size, index) => ({
			size,
			amount: this.amounts[index],
			unit: this.units[index],
		}));
	}

	public toString() {
		return `${this.id} | ${this.name || "-"} | ${new Intl.NumberFormat(
			"de-DE",
			{
				currency: "EUR",
				style: "currency",
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}
		).format(this.price)} | ${this.producer || "-"}`;
	}
}
