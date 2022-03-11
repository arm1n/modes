import type { KeysWithoutFunctions } from "types";
import type { Model } from "../models";

export type CSVItem = Record<string, unknown>;
export type CSVData = CSVItem[];

export type CSVMapping<M extends Model> = Partial<
	Record<KeysWithoutFunctions<M>, string>
>;

export type CSVColumns<M extends Model> = {
	[K in keyof CSVMapping<M>]: boolean;
};
export type CSVFormatters<M extends Model> = {
	[K in keyof CSVMapping<M>]: (value: unknown) => string;
};
