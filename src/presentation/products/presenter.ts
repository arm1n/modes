import { t } from "i18n";
import { Result } from "utils";
import type { Loading, Success, Failure, Subscription } from "utils";

import type { GetProductsUseCase } from "domain/use-cases/product";
import type { Product } from "domain/models";

import { BasePresenter } from "../base";
import { ActionPresenter, RedirectToPageEffect } from "../types";
import type {
	SearchPresenterFactory,
	Presenter as SearchPresenter,
} from "../search";

type State = {
	loadedProducts: Loading | Success<Product[]> | Failure<Error>;
	filteredProducts: Loading | Success<Product[]> | Failure<Error>;
};
type Effects = RedirectToPageEffect<
	| { name: "clear" }
	| { name: "import" }
	| { name: "create-order"; productId: Product["id"] }
>;
type Actions = {
	clearProducts: () => void;
	importProducts: () => void;
	orderProduct: (productId: Product["id"]) => void;
};

const INITIAL_STATE = {
	loadedProducts: Result.loading(),
	filteredProducts: Result.loading(),
};

export class Presenter
	extends BasePresenter<State, Effects>
	implements ActionPresenter<Actions>
{
	public searchPresenter: SearchPresenter<Product>;
	private searchSubscription: Subscription | null = null;

	constructor(
		private getProductsUseCase: GetProductsUseCase,
		private searchPresenterFactory: SearchPresenterFactory
	) {
		super(INITIAL_STATE);

		this.searchPresenter = searchPresenterFactory.create();
	}

	public async onInit() {
		await this.loadProducts();

		this.searchSubscription = this.searchPresenter.effects$.subscribe({
			update: ({ name, data }) => {
				switch (name) {
					case "onFiltered":
						this.dispatchState({
							filteredProducts: data,
						});
						break;
					default:
				}
			},
		});
	}

	public get actions() {
		return {
			clearProducts: this.clearProducts.bind(this),
			importProducts: this.importProducts.bind(this),
			orderProduct: this.orderProduct.bind(this),
		};
	}

	private async loadProducts() {
		this.dispatchState({
			loadedProducts: Result.loading(),
			filteredProducts: Result.loading(),
		});

		const result = await this.getProductsUseCase.execute();
		const products = Result.isFailure(result)
			? Result.failure(new Error(t("Could not load products!")))
			: result;

		this.searchPresenter.providers.setCollection(products);

		this.dispatchState({
			loadedProducts: products,
			filteredProducts: products,
		});
	}

	private clearProducts() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "clear",
				},
			},
		});
	}

	private importProducts() {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "import",
				},
			},
		});
	}

	private orderProduct(productId: Product["id"]) {
		this.dispatchEffect({
			name: "redirectToPage",
			data: {
				page: {
					name: "create-order",
					productId,
				},
			},
		});
	}
}
