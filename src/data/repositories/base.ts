import type { Json } from "types";
import type { Model, ModelType } from "domain/models";
import type { Repository } from "domain/repositories";
import { Result } from "utils";

import type { Database } from "../databases";
import type { Mapper } from "../mappers";

export class Base<M extends Model, D extends Model & Json>
	implements Repository<M>
{
	constructor(
		protected database: Database,
		protected mapper: Mapper<M, D>,
		protected type: ModelType<M>
	) {}

	public async all() {
		const result = await this.database.all<M, D>(this.type);
		if (Result.isFailure(result)) {
			return result;
		}

		return Result.success(
			result.value.map((item) => this.mapper.toModel(item))
		);
	}

	public async clear() {
		const result = await this.database.clear<M, D>(this.type);
		if (Result.isFailure(result)) {
			return result;
		}

		return Result.success();
	}

	public async get(id: string) {
		const result = await this.database.get<M, D>(this.type, id);
		if (Result.isFailure(result)) {
			return Result.failure(result.error, { model: { id } });
		}

		return Result.success(
			result.value ? this.mapper.toModel(result.value) : null
		);
	}



	public async remove(model: M) {
		const data = this.mapper.toData(model);
		const result = await this.database.delete<M, D>(
			this.getType(model),
			data
		);

		if (Result.isFailure(result)) {
			return Result.failure(result.error, { model });
		}

		return result;
	}

	public async persist(model: M) {
		const data = this.mapper.toData(model);
		const result = await this.database.persist<M, D>(
			this.getType(model),
			data
		);

		if (Result.isFailure(result)) {
			return Result.failure(result.error, { model });
		}

		return result;
	}

	private getType(model: M) {
		return model.constructor as ModelType<M>;
	}
}
