import type { Success, Failure } from "utils";

import type { Model } from "../models";
import type { ImportErrorCode } from "../enums";

import type { CSVData, CSVMapping } from "./types";

export interface ImportService<M extends Model> {
	fromCSV(
		data: CSVData,
		mappings: CSVMapping<M>,
		options?: {
			locale?: string;
		}
	): Promise<
		Success<number> | Failure<ImportError, { ids: string[] } | undefined>
	>;
}

export interface ImportError extends Error {
	code: ImportErrorCode;
}
