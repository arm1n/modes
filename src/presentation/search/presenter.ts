import { Result, escapeRegExp, debounce } from "utils";
import type { Loading, Success, Failure } from "utils";

import { BasePresenter } from "../base";
import type { ActionPresenter, ProviderPresenter } from "../types";

type State = {
	query: string;
};
type Effects<T extends object> = {
	onFiltered: Success<T[]>;
};
type Actions = {
	update: (query: string) => void;
	search: () => void;
};
type Providers<T extends object> = {
	resetSearch: () => void;
	setCollection: (collection: Collection<T>) => void;
};
type Collection<T extends object> = Success<T[]> | Failure<Error> | Loading;

const INITIAL_STATE = {
	query: "",
};

export class Presenter<T extends object = object>
	extends BasePresenter<State, Effects<T>>
	implements ActionPresenter<Actions>, ProviderPresenter<Providers<T>>
{
	private collection: Collection<T> = Result.loading();

	constructor() {
		super(INITIAL_STATE);
	}

	public get providers() {
		return {
			resetSearch: this.resetSearch.bind(this),
			setCollection: this.setCollection.bind(this),
		};
	}

	public get actions() {
		return {
			update: this.update.bind(this),
			search: this.search.bind(this),
		};
	}

	private setCollection(collection: Collection<T>) {
		this.collection = collection;
	}

	private resetSearch() {
		if (!Result.isSuccess(this.collection)) {
			return;
		}
		
		this.dispatchState({
			query: "",
		});
		
		this.dispatchEffect({
			name: "onFiltered",
			data: this.collection,
		});
	}

	private update(query: string) {
		this.dispatchState({ query });
	}

	private search = debounce(async() => {
		if (!Result.isSuccess(this.collection)) {
			return;
		}

		if (!this.state.query) {
			this.resetSearch();
			return;
		}

		const regex = new RegExp(`${escapeRegExp(this.state.query)}`, "gi");

		this.dispatchEffect({
			name: "onFiltered",
			data: Result.success(
				this.collection.value.filter(
					(item) => item.toString().search(regex) >= 0
				)
			),
		});
	})
}
