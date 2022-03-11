import { Result } from "utils";

import type {
	ExportService,
	ExportError,
	CSVMapping,
	CSVColumns,
	CSVFormatters,
} from "domain/services";
import type { ExportErrorCode } from "domain/enums";
import { ComposedOrder } from "domain/models";
import { EXPORT_ERROR_CODES } from "domain/enums";

type Mappings = CSVMapping<ComposedOrder>;
type Columns = CSVColumns<ComposedOrder>;
type Formatters = CSVFormatters<ComposedOrder>;

export class OrderExportService implements ExportService<ComposedOrder> {
	public async toCSV(
		data: ComposedOrder[],
		mappings: Mappings,
		{
			columns = {},
			formatters = {},
		}: { columns?: Columns; formatters?: Formatters }
	) {
		const keys = (Object.keys(mappings) as Array<keyof Mappings>).filter(
			(key) =>
				typeof mappings[key] !== "undefined" && columns[key] === true
		);

		if (keys.length === 0) {
			return Result.failure(
				new OrderExportError(EXPORT_ERROR_CODES.NO_KEYS)
			);
		}

		const head = keys.map((key) => `${mappings[key]}`);

		if (data.length === 0) {
			return Result.failure(
				new OrderExportError(EXPORT_ERROR_CODES.NO_ROWS)
			);
		}

		const body = data.map((row) =>
			keys.map((key) => {
				const value = row[key];
				const formatter = formatters[key];

				return formatter ? formatter(value) : `${value}`;
			})
		);

		const rows = [head, ...body];
		return Result.success(rows);
	}
}

export class OrderExportError extends Error implements ExportError {
	constructor(public readonly code: ExportErrorCode) {
		super();
	}
}
