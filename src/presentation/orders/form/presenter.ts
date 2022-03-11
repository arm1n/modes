import { t } from "i18n";
import { Result } from "utils";
import type { Failure } from "utils";

import type { GetProductsUseCase } from "domain/use-cases/product";
import type { PaymentType } from "domain/enums";
import { PAYMENT_TYPES } from "domain/enums";
import type { Product } from "domain/models";

import { BasePresenter } from "../../base";
import type { ActionPresenter, ProviderPresenter } from "../../types";

type Fields = {
	product: Product | null;
	quantity: number;
	size: number;
	paymentType: string;
	orderNumber: string;
};

type State = {
	fields: Fields;
	isValid: boolean;
	isBusy: boolean;
	validations: Record<keyof Fields, undefined | null | string>;
	products: Product[];
	sizes: number[];
	paymentTypes: Array<{
		value: PaymentType;
		label: string;
	}>;
};
type Effects = {
	onProductsFailure: Failure<Error>;
	onValidate: {
		validations: State["validations"];
		isValid: State["isValid"];
	};
};
type Actions = {
	changeProductHandler: (product: Product | null) => void;
	changeSizeHandler: (size: number) => void;
	changeQuantityHandler: (quantity: number) => void;
	changePaymentTypeHandler: (paymentType: string) => void;
	changeOrderNumberHandler: (orderNumber: string) => void;
	getProductById: (productId: Product["id"]) => Product | null;
};
type Providers = {
	setFields: (fields: State["fields"]) => void;
};

export type RuntimeData = {
	productId?: string;
};

const INITIAL_STATE = {
	fields: {
		product: null,
		quantity: 1,
		size: 0,
		paymentType: PAYMENT_TYPES.CASH,
		orderNumber: "",
	},
	products: [],
	sizes: [],
	paymentTypes: [
		{
			value: PAYMENT_TYPES.CASH,
			label: t("CASH"),
		},
		{
			value: PAYMENT_TYPES.DEBIT_CARD,
			label: t("DEBIT_CARD"),
		},
	],
	isBusy: false,
	isValid: false,
	validations: {
		product: null,
		quantity: null,
		size: null,
		paymentType: null,
		orderNumber: undefined,
	},
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>, ProviderPresenter<Providers>
{
	constructor(
		private readonly getProductsUseCase: GetProductsUseCase,
		private readonly runtimeData: RuntimeData = {
			productId: undefined,
		}
	) {
		super(INITIAL_STATE);
	}

	public async onInit() {
		const result = await this.getProductsUseCase.execute();
		if (Result.isFailure(result)) {
			return this.dispatchEffect({
				name: "onProductsFailure",
				data: Result.failure(new Error(t("Could not load products!"))),
			});
		}

		const { value: products } = result;
		products.sort();

		this.dispatchState({
			products,
		});

		const { productId } = this.runtimeData;
		const product = productId ? this.getProductById(productId) : null;
		if (product === null) {
			return;
		}

		this.changeProductHandler(product);
	}

	public get actions() {
		return {
			changeProductHandler: this.changeProductHandler.bind(this),
			changeSizeHandler: this.changeSizeHandler.bind(this),
			changeQuantityHandler: this.changeQuantityHandler.bind(this),
			changePaymentTypeHandler: this.changePaymentTypeHandler.bind(this),
			changeOrderNumberHandler: this.changeOrderNumberHandler.bind(this),
			getProductById: this.getProductById.bind(this),
		};
	}

	public get providers() {
		return {
			setFields: this.setFields.bind(this),
		};
	}

	private setFields({
		product,
		size,
		quantity,
		paymentType,
		orderNumber,
	}: State["fields"]) {
		this.changeProductHandler(product);
		this.changeSizeHandler(size);
		this.changeQuantityHandler(quantity);
		this.changePaymentTypeHandler(paymentType);
		this.changeOrderNumberHandler(orderNumber);
	}

	private changeProductHandler(product: Product | null) {
		const sizes = product ? [...product.sizes] : [];
		sizes.sort();

		const size = product ? sizes[0] : 0;
		const fields = {
			...this.state.fields,
			product,
			size,
		};

		this.dispatchState({
			sizes,
			fields,
			...this.validate(fields),
		});
	}

	private changeSizeHandler(size: number) {
		const fields = {
			...this.state.fields,
			size,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private changeQuantityHandler(quantity: number) {
		const fields = {
			...this.state.fields,
			quantity,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private changePaymentTypeHandler(paymentType: string) {
		if (!this.isPaymentType(paymentType)) {
			return;
		}

		const fields = {
			...this.state.fields,
			paymentType,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private changeOrderNumberHandler(orderNumber: string) {
		const fields = {
			...this.state.fields,
			orderNumber,
		};

		this.dispatchState({
			fields,
			...this.validate(fields),
		});
	}

	private getProductById(productId: Product["id"]) {
		return this.state.products.find(({ id }) => id === productId) || null;
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
		const data = {
			isValid,
			validations,
		};

		this.dispatchEffect({
			name: "onValidate",
			data,
		});

		return data;
	}

	private isPaymentType(value: string): value is PaymentType {
		return value in PAYMENT_TYPES;
	}
}
