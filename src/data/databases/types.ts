import type { Json } from "types";
import type { Success, Failure } from "utils";
import type { Model, ModelType } from "domain/models";

export interface Database {
	all<M extends Model, D extends Json & Model>(
		type: ModelType<M>
	): Promise<Success<D[]> | Failure<Error>>;
	clear<M extends Model, D extends Json & Model>(
		type: ModelType<M>
	): Promise<Success | Failure<Error>>;
	get<M extends Model, D extends Json & Model>(
		type: ModelType<M>,
		id: string
	): Promise<Success<D | null> | Failure<Error>>;
	delete<M extends Model, D extends Json & Model>(
		type: ModelType<M>,
		data: D
	): Promise<Success | Failure<Error>>;
	persist<M extends Model, D extends Json & Model>(
		type: ModelType<M>,
		data: D
	): Promise<Success | Failure<Error>>;
}
