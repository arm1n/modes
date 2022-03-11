import { t } from "i18n";
import { Result } from "utils";
import type { ExportOrdersUseCase } from "domain/use-cases/order";
import { DELIMITERS, PAYMENT_TYPES, EXPORT_ERROR_CODES, DOWNLOAD_ERROR_CODES } from "domain/enums";
import type { Delimiter, PaymentType } from "domain/enums";

import { BasePresenter } from "../../base";
import type {
	ActionPresenter,
	RedirectToPageEffect,
	NotificationEffect,
} from "../../types";

type Fields = {
	delimiter: Delimiter;
	columns: {
		productId: boolean;
		quantity: boolean;
		price: boolean;
		size: boolean;
		paymentType: boolean;
		orderNumber: boolean;
	};
};

type State = {
	isBusy: boolean;
	isValid: boolean;
	fields: Fields;
	delimiters: Array<{ name: string; value: Delimiter }>;
};
type Effects = RedirectToPageEffect<"orders"> & NotificationEffect;
type Actions = {
	save: () => void;
	cancel: () => void;
	changeDelimiterHandler: (delimiter: Delimiter) => void;
	changeColumnHandler: (name: keyof Fields["columns"], value: boolean) => void;
};

const INITIAL_STATE = {
	isBusy: false,
	isValid: true,
	fields: {
		delimiter: DELIMITERS.SEMICOLON,
		columns: {
			productId: true,
			quantity: true,
			price: true,
			size: true,
			paymentType: true,
			orderNumber: true,
		},
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
};

const PAYMENT_TYPE_LABELS = {
	[PAYMENT_TYPES.DEBIT_CARD]: t("DEBIT_CARD"),
	[PAYMENT_TYPES.CASH]: t("CASH"),
} as const;

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	constructor(private readonly exportOrdersUseCase: ExportOrdersUseCase) {
		super(INITIAL_STATE);
	}

	public get actions() {
		return {
			save: this.save.bind(this),
			cancel: this.cancel.bind(this),
			changeColumnHandler: this.changeColumnHandler.bind(this),
			changeDelimiterHandler: this.changeDelimiterHandler.bind(this),
		};
	}

	private async save() {
		const {
			fields: { delimiter, columns },
			isValid,
		} = this.state;
		if (!isValid) {
			return;
		}

		this.dispatchState({ isBusy: true });

		const result = await this.exportOrdersUseCase.execute({
			columns,
			formatters: {
				paymentType: (value) =>
					this.isPaymentType(value)
						? PAYMENT_TYPE_LABELS[value]
						: `${value}`,

			},
			delimiter
		});

		this.dispatchState({ isBusy: false });

		if (Result.isSuccess(result)) {
			this.dispatchEffect({
				name: "showNotification",
				data: Result.success({
					message: t("Orders have been successfully exported."),
				}),
			});

			this.dispatchEffect({
				name: "redirectToPage",
				data: {
					page: "orders",
				},
			});

			return;
		}

		let message: string;

		switch (result.error.reason.code) {
			case EXPORT_ERROR_CODES.NO_DATA:
				message = t("Data for export could not be fetched.");
				break;
			case EXPORT_ERROR_CODES.NO_KEYS:
				message = t("No columns were provided to be exported.");
				break;
			case EXPORT_ERROR_CODES.NO_ROWS:
				message = t("No rows are available to be exported.");
				break;
			case DOWNLOAD_ERROR_CODES.NO_SUPPORT_OBJECT_URL:
				message = t("No support for object urls in your browser.");
				break;
			case DOWNLOAD_ERROR_CODES.NO_SUPPORT_BLOB:
				message = t("No support for blob objects in your browser.");
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
			data: { page: "orders" },
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

	private changeColumnHandler(name: keyof Fields["columns"], value: boolean) {
		const columns = {
			...this.state.fields.columns,
			[name]: value,
		};

		const fields = {
			...this.state.fields,
			columns,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private validate({ columns }: State["fields"]) {
		const keys = Object.keys(columns) as Array<
			keyof State["fields"]["columns"]
		>;
		const selection = keys.filter((key) => columns[key] === true);

		return {
			isValid: selection.length > 0,
		};
	}

	private isPaymentType(value: unknown): value is PaymentType {
		return typeof value === "string" && value in PAYMENT_TYPE_LABELS;
	}
}
