import { Result } from "utils";
import type { Failure } from "utils";

import type {
	ImportService,
	ImportError,
	CSVData,
	CSVItem,
	CSVMapping,
} from "domain/services";
import type { ProductRepository } from "domain/repositories";
import type { ImportErrorCode } from "domain/enums";
import { Product } from "domain/models";
import type { Model } from "domain/models";
import { IMPORT_ERROR_CODES } from "domain/enums";

type Mappings = CSVMapping<Product>;

export class ProductImportService implements ImportService<Product> {
	constructor(private readonly productRepository: ProductRepository) {}

	public async fromCSV(
		data: CSVData,
		mappings: Mappings,
		{ locale = "en-US" }: { locale?: string } = {}
	) {
		if (data.length === 0) {
			return Result.failure(
				new ProductImportError(IMPORT_ERROR_CODES.NO_DATA)
			);
		}

		const keys = Object.keys(mappings) as Array<keyof Mappings>;
		if (keys.length === 0) {
			return Result.failure(
				new ProductImportError(IMPORT_ERROR_CODES.NO_KEYS)
			);
		}

		const filtered = data.filter((row) => {
			return this.validateRow(row, mappings);
		});
		if (filtered.length === 0) {
			return Result.failure(
				new ProductImportError(IMPORT_ERROR_CODES.NO_VALID_DATA)
			);
		}

		const invalid: Record<string, boolean> = {};
		const map = filtered.reduce((map, row) => {
			const props = keys.reduce((props, key) => {
				const rowKey = mappings[key];

				if (typeof rowKey === "string") {
					const value = row[rowKey];

					if (typeof value === "string") {
						switch (key) {
							case "units":
								props[key] = [value];
								break;

							case "sizes":
							case "amounts":
								props[key] = [this.parseNumber(value, locale)];
								break;

							case "price":
								props[key] = this.parseNumber(value, locale);
								break;

							case "taxRate":
								props[key] = this.parseNumber(value, locale);
								if (!isNaN(props[key])) {
									props[key] /= 100;
								}

								break;

							default:
								props[key] = value;
								break;
						}
					} else {
						invalid[rowKey] = true;
					}
				}

				return props;
			}, {} as Product);

			const product = map.get(props.id);

			if (!product) {
				map.set(props.id, new Product(props));
			} else {
				const { sizes = [], units = [], amounts = [] } = props;

				if (!product.sizes.includes(sizes[0])) {
					product.sizes = [...product.sizes, ...sizes];
					product.units = [...product.units, ...units];
					product.amounts = [...product.amounts, ...amounts];
				} else {
					const index = product.sizes.indexOf(props.sizes[0]);
					console.log(props.id, index, product.amounts[index], props.amounts[0])
					if (index >= 0) {
						product.amounts[index] += props.amounts[0];
					}
				}
			}

			return map;
		}, new Map<string, Product>());

		const promises = await Promise.all(
			Array.from(map).map(([, product]) => 
				this.productRepository.persist(product)
			)
		);

		const failures = promises.filter(
			(result): result is Failure<Error, { model: Model }> =>
				Result.isFailure(result)
		);
		if (failures.length > 0) {
			return Result.failure(
				new ProductImportError(IMPORT_ERROR_CODES.NO_SUCCESS),
				{
					ids: failures.map(({ meta }) => meta.model.id),
				}
			);
		}

		return Result.success({ count: map.size, invalidKeys: Object.keys(invalid) });
	}

	private validateRow(row: CSVItem, mappings: Mappings) {
		const id = row[mappings.id || ""];
		if (typeof id !== "string") {
			return false;
		}

		return id.length > 0;
	}

	private parseNumber(value: string = "", locale: string = "") {
		const dummy = new Intl.NumberFormat(locale).format(0.5);
		const separator = dummy.charAt(1); // get '.' from dummy

		const regex = new RegExp(`[^-+0-9${separator}]`, "g");

		const clean = value.replace(regex, "");
		const normalized = clean.replace(separator, ".");

		return parseFloat(normalized);
	}
}

export class ProductImportError extends Error implements ImportError {
	constructor(public readonly code: ImportErrorCode) {
		super();
	}
}
