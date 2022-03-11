import type { KeysWithoutFunctions } from "types";

import type { Model } from "./types";

export type Data = Pick<Product, KeysWithoutFunctions<Product>>;

export class Product implements Model {
	constructor(props: Data) {
		this.id = props.id;
		this.name = props.name;
		this.price = props.price;
		this.taxRate = props.taxRate;
		this.amounts = props.amounts;
		this.units = props.units;
		this.sizes = props.sizes;
		this.producer = props.producer;
	}

	public id: string;
	public name: string;
	public price: number;
	public taxRate: number;
	public units: string[];
	public amounts: number[];
	public sizes: number[];
	public producer: string;

	public getVariations() {
		return this.sizes.map((size, index) => ({
			size,
			amount: this.amounts[index],
			unit: this.units[index],
		}));
	}

	public toString() {
		return `${this.id} | ${this.name || '-'} | ${this.producer || '-'}`;
	}
}
