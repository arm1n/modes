import type { Success, Failure } from "utils";

import type { Model } from "../models";
import type { ExportErrorCode } from "../enums";

import type { CSVMapping, CSVColumns, CSVFormatters } from "./types";

export interface ExportService<M extends Model> {
	toCSV(
		data: M[],
		mappings: CSVMapping<M>,
		options?: {
			columns?: CSVColumns<M>;
			formatters?: CSVFormatters<M>;
		}
	): Promise<Success<Array<string[]>> | Failure<ExportError>>;
}

export interface ExportError extends Error {
	code: ExportErrorCode;
}
