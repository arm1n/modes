import { Result } from "utils";
import type { Json } from "types";
import type { Model, ModelType } from "domain/models";

import type { Storage } from "../storages";

import type { Database } from "./types";

export class StorageDatabase implements Database {
	constructor(protected storage: Storage) {}

	public async all<M extends Model, D extends Json & Model>({
		name,
	}: ModelType<M>) {
		try {
			const table = this.getTable<D>(name);
			const items = Object.keys(table).map((id) => table[id]);

			return Result.success(items);
		} catch (e) {
			return Result.failure(new Error(`Could not load collection!`));
		}
	}

	public async clear<M extends Model, D extends Json & Model>({
		name,
	}: ModelType<M>) {
		try {
			this.storage.removeItem(name)
			return Result.success();
		} catch (e) {
			return Result.failure(new Error(`Could not clear collection!`));
		}
	}

	public async get<M extends Model, D extends Json & Model>(
		{ name }: ModelType<M>,
		id: string
	) {
		try {
			const table = this.getTable<D>(name);
			const item = this.isData(table[id]) ? table[id] : null;

			return Result.success(item);
		} catch (e) {
			return Result.failure(new Error(`Could not load item!`));
		}
	}

	public async delete<M extends Model, D extends Json & Model>(
		{ name }: ModelType<M>,
		data: D
	) {
		try {
			const { [data.id]: _, ...table } = this.getTable<D>(name);
			this.setTable(name, table);
			return Result.success();
		} catch (e) {
			return Result.failure(new Error(`Could not delete data!`));
		}
	}

	public async persist<M extends Model, D extends Json & Model>(
		type: ModelType<M>,
		data: D
	) {
		try {
			this.setTable(type.name, {
				...this.getTable(type.name),
				[data.id]: data,
			});

			return Result.success();
		} catch (e) {
			return Result.failure(new Error(`Could not save data!`));
		}
	}

	private getTable<D extends Json & Model>(name: string) {
		const table = this.storage.getItem(name);
		return this.isTable<D>(table) ? table : {};
	}

	private setTable(name: string, table: Record<string, Json>) {
		this.storage.setItem(name, table);
	}

	private isTable<D extends Json & Model>(
		table: unknown
	): table is Record<string, D> {
		return (
			typeof table === "object" && !Array.isArray(table) && table !== null
		);
	}

	private isData<D extends Json & Model>(item: unknown): item is D {
		return (
			typeof item === "object" &&
			!Array.isArray(item) &&
			item !== null &&
			"id" in item
		);
	}
}
