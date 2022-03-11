import type { Success, Failure } from "utils";

import type { Model } from "../models";

export interface Repository<T extends Model> {
	all(): Promise<Success<T[]> | Failure<Error>>;
	get(
		id: string
	): Promise<Success<T | null> | Failure<Error, { model: Model }>>;
	remove(model: T): Promise<Success | Failure<Error, { model: Model }>>;
	persist(model: T): Promise<Success | Failure<Error, { model: Model }>>;
	clear(): Promise<Success | Failure<Error>>;
}
