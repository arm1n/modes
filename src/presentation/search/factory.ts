import type { Factory } from "../types";

import { Presenter } from "./presenter";

export class SearchPresenterFactory implements Factory<Presenter> {
	public create<T extends object>() {
		return new Presenter<T>();
	}
}
