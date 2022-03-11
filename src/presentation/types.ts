import type { Success, Failure, Observable } from "utils";

export type State = Record<string, unknown>;
export type Effects = Record<string, unknown>;
export type Actions = Record<string, unknown>;
export type Providers = Record<string, unknown>;

export type Effect<T extends Effects> = {
	[K in keyof T]: { name: K; data: T[K] };
}[keyof T];

export interface Presenter<
	S extends State = State,
	E extends Effects = Effects
> {
	state: S;

	state$: Observable<S>;
	effects$: Observable<Effect<E>>;
	init(): Promise<void>;
	dispose(): void;
}

export interface ActionPresenter<A extends Actions = Actions> {
	actions: A;
}

export interface ProviderPresenter<P extends Providers = Providers> {
	providers: P;
}

export interface Factory<P extends Presenter> {
	create(...args: unknown[]): P;
}

export type RedirectToPageEffect<T = unknown> = {
	redirectToPage: { page: T };
};

export type NotificationEffect = {
	showNotification:
		| Success<{
				message: string;
				persistent?: boolean;
				type?: "success" | "error" | "warning" | "info";
		  }, unknown>
		| Failure<Error, unknown>;
};
