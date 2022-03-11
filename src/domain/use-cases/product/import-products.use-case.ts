import { Result } from "utils";
import type { Success, Failure } from "utils";

import type { UseCase } from "../types";
import type {
	CSVService,
	ImportService,
	CSVError,
	ImportError,
} from "../../services";
import type { Product } from "../../models";
import type { Delimiter } from "../../enums";
import { ENCODINGS } from "../../enums";

const IMPORT_MAPPINGS = {
	id: "Artikelnummer",
	name: "Titel",
	price: "Preis",
	taxRate: "Steuersatz",
	amounts: "Anzahl",
	units: "Einheit",
	sizes: "Erlöskonto/Ringgröße",
	producer: "Hersteller",
};

type Input = {
	file: File;
	delimiter: Delimiter;
};

type Output = Promise<
	Success<number> | Failure<ImportProductsError, { ids: string[] } | undefined>
>;

export class ImportProductsUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly csvService: CSVService,
		private readonly importService: ImportService<Product>
	) {}

	public async execute({ file, delimiter }: Input) {
		const csvResult = await this.csvService.read(file, {
			encoding: ENCODINGS.ISO_8859_1,
			delimiter,
		});

		if (Result.isFailure(csvResult)) {
			return Result.failure(
				new ImportProductsError(csvResult.error),
				csvResult.meta
			);
		}

		const importResult = await this.importService.fromCSV(
			csvResult.value,
			IMPORT_MAPPINGS,
			{
				locale: "de-DE",
			}
		);

		if (Result.isFailure(importResult)) {
			return Result.failure(
				new ImportProductsError(importResult.error),
				importResult.meta
			);
		}

		return importResult;
	}
}

class ImportProductsError extends Error {
	constructor(public reason: CSVError | ImportError) {
		super(reason.message);
	}
}
