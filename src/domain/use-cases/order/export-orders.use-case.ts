import { Result } from "utils";
import type { Success, Failure } from "utils";

import type {
	CSVService,
	DownloadService,
	DownloadError,
	ExportService,
	ExportError,
	CSVError,
	CSVColumns,
	CSVFormatters,
} from "../../services";
import type { ComposedOrder } from "../../models";
import { EXPORT_ERROR_CODES, ENCODINGS } from "../../enums";
import type { ExportErrorCode, Delimiter } from "../../enums";

import type { UseCase } from "../types";
import type { GetComposedOrdersUseCase } from "./get-composed-orders.use-case";

const EXPORT_MAPPINGS = {
	productId: "sku",
	quantity: "qty",
	price: "price_single",
	size: "ringsize",
	paymentType: "zahlungsart",
	orderNumber: "bestellnummer",
};

type Columns = CSVColumns<ComposedOrder>;
type Formatters = CSVFormatters<ComposedOrder>;

type Input = {
	columns?: Columns;
	formatters?: Formatters;
	delimiter?: Delimiter;
};
type Output = Promise<
	Success<void> | Failure<ExportOrdersError, { models: string[] } | undefined>
>;

export class ExportOrdersUseCase implements UseCase<Input, Output> {
	constructor(
		private getComposedOrdersUseCase: GetComposedOrdersUseCase,
		private exportOrdersService: ExportService<ComposedOrder>,
		private downloadService: DownloadService,
		private csvService: CSVService
	) {}

	public async execute({ columns, formatters, delimiter }: Input) {
		const ordersResult = await this.getComposedOrdersUseCase.execute();
		if (Result.isFailure(ordersResult)) {
			return Result.failure(
				new ExportOrdersError(
					new FetchError(EXPORT_ERROR_CODES.NO_DATA)
				)
			);
		}

		const exportResult = await this.exportOrdersService.toCSV(
			ordersResult.value,
			EXPORT_MAPPINGS,
			{
				columns,
				formatters,
			}
		);

		if (Result.isFailure(exportResult)) {
			return Result.failure(
				new ExportOrdersError(exportResult.error),
				exportResult.meta
			);
		}

		const csvResult = await this.csvService.write(exportResult.value, {
			delimiter,
		});

		if (Result.isFailure(csvResult)) {
			return Result.failure(
				new ExportOrdersError(csvResult.error),
				csvResult.meta
			);
		}

		const downloadResult = await this.downloadService.download(
			csvResult.value,
			{
				contentType: "text/csv",
				fileName: "bestellungen.csv",
				encoding: ENCODINGS.ISO_8859_1,
			}
		);

		if (Result.isFailure(downloadResult)) {
			return Result.failure(
				new ExportOrdersError(downloadResult.error),
				downloadResult.meta
			);
		}

		return Result.success();
	}
}

class ExportOrdersError extends Error {
	constructor(public reason: ExportError | CSVError | DownloadError) {
		super(reason.message);
	}
}

class FetchError extends Error implements ExportError {
	constructor(public readonly code: ExportErrorCode) {
		super();
	}
}
