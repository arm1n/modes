import { n, t } from "i18n";
import { Result } from "utils";

import type { ImportProductsUseCase } from "domain/use-cases/product";
import type { Delimiter } from "domain/enums";
import { DELIMITERS, CSV_ERROR_CODES, IMPORT_ERROR_CODES } from "domain/enums";

import { BasePresenter } from "../../base";
import type {
	ActionPresenter,
	RedirectToPageEffect,
	NotificationEffect,
} from "../../types";

type Fields = {
	file?: File | null;
	delimiter: Delimiter;
};

type State = {
	fields: Fields;
	isValid: boolean;
	validations: Record<keyof Fields, null | string | undefined>;
	delimiters: Array<{ name: string; value: Delimiter }>;
	isBusy: boolean;
};
type Effects = RedirectToPageEffect<"products"> & NotificationEffect;
type Actions = {
	save: () => void;
	cancel: () => void;
	changeDelimiterHandler: (delimiter: Delimiter) => void;
	changeFileHandler: (fileList: FileList | null) => void;
};

const INITIAL_STATE = {
	fields: {
		file: undefined,
		delimiter: DELIMITERS.SEMICOLON,
	},
	delimiters: [
		{
			name: t("Comma"),
			value: DELIMITERS.COMMA,
		},
		{
			name: t("Semicolon"),
			value: DELIMITERS.SEMICOLON,
		},
		{
			name: t("Space"),
			value: DELIMITERS.SPACE,
		},
		{
			name: t("Tab"),
			value: DELIMITERS.TAB,
		},
		{
			name: t("Pipe"),
			value: DELIMITERS.PIPE,
		},
	],
	isBusy: false,
	isValid: false,
	validations: {
		file: null,
		delimiter: undefined,
	},
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	constructor(private importProductsUseCase: ImportProductsUseCase) {
		super(INITIAL_STATE);
	}

	public get actions() {
		return {
			save: this.save.bind(this),
			cancel: this.cancel.bind(this),
			changeDelimiterHandler: this.changeDelimiterHandler.bind(this),
			changeFileHandler: this.changeFileHandler.bind(this),
		};
	}

	private async save() {
		const {
			fields: { file, delimiter },
		} = this.state;
		if (!file) {
			return;
		}

		this.dispatchState({ isBusy: true });

		const result = await this.importProductsUseCase.execute({
			file,
			delimiter,
		});

		this.dispatchState({ isBusy: false });

		if (Result.isSuccess(result)) {
			const {
				value: { count, invalidKeys },
			} = result;

			if (invalidKeys.length === 0) {
				this.dispatchEffect({
					name: "showNotification",
					data: Result.success({
						message: n(
							"{{count}} product has been successfully imported.",
							"{{count}} products has been successfully imported.",
							count
						),
					}),
				});
			} else {
				this.dispatchEffect({
					name: "showNotification",
					data: Result.success({
						message: n(
							"{{count}} product has been imported with missing columns: {{columns}}",
							"{{count}} products has been imported with missing columns: {{columns}}",
							count,
							{
								columns: invalidKeys.join(","),
							}
						),
						type: "warning"
					}),
				});
			}

			this.dispatchEffect({
				name: "redirectToPage",
				data: {
					page: "products",
				},
			});

			return;
		}

		let message: string;

		switch (result.error.reason.code) {
			case CSV_ERROR_CODES.NO_READ_PARSING:
				message = t("Could not parse file.");
				break;
			case CSV_ERROR_CODES.NO_READ_HEADERS:
				message = t("No headers were found in first row of file.");
				break;
			case IMPORT_ERROR_CODES.NO_DATA:
				message = t("No data were provided to be imported.");
				break;
			case IMPORT_ERROR_CODES.NO_KEYS:
				message = t("No keys were provided to be imported.");
				break;
			case IMPORT_ERROR_CODES.NO_VALID_DATA:
				message = t(
					"No valid data (missing SKUs) were provided to be imported."
				);
				break;
			case IMPORT_ERROR_CODES.NO_SUCCESS:
				message = t("The following SKUs contained errors: {{ids}}.", {
					ids: result.meta?.ids.join(",") || "",
				});

				break;

			default:
				message = t("An unknown error occured");
		}

		this.dispatchEffect({
			name: "showNotification",
			data: Result.failure(new Error(message)),
		});
	}

	private cancel() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: { page: "products" },
		});
	}

	private changeDelimiterHandler(delimiter: string) {
		const matched = Object.values(DELIMITERS).find(
			(current) => current === delimiter
		);
		if (!matched) {
			return;
		}

		const fields = {
			...this.state.fields,
			delimiter: matched,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private changeFileHandler(fileList: FileList | null) {
		const file = fileList ? fileList[0] : null;

		const fields = {
			...this.state.fields,
			file,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private validate(fields: State["fields"]) {
		const keys = Object.keys(fields) as Array<keyof State["fields"]>;

		const validations = keys.reduce((validations, key) => {
			if (typeof validations[key] !== "undefined") {
				validations[key] =
					typeof fields[key] === "undefined"
						? t("Missing value")
						: null;
			}

			return validations;
		}, this.state.validations);

		const isValid = keys.filter((key) => !!validations[key]).length === 0;

		return {
			isValid,
			validations,
		};
	}
}
