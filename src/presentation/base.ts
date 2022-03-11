import { BehaviorSubject, Subject } from "utils";

import type { Presenter, State, Effects, Effect } from "./types";

export abstract class BasePresenter<S extends State, E extends Effects>
	implements Presenter<S, E>
{
	public state$: BehaviorSubject<S>;
	public effects$: Subject<Effect<E>>;

	constructor(initialState: S) {
		this.state$ = new BehaviorSubject(initialState);
		this.effects$ = new Subject();
	}

	public async init() {
		await this.onInit();
	}
	public async dispose() {
		this.onDispose();
	}

	public async onInit() {}
	public onDispose() {}

	public get state() {
		return this.state$.value;
	}

	protected reduceState(oldState: S, newState: Partial<S>): S {
		return { ...oldState, ...newState };
	}

	protected dispatchState(newState: Partial<S>): void {
		const state = this.reduceState(this.state, newState);
		this.state$.notify(state);
	}

	protected dispatchEffect(effect: Effect<E>): void {
		this.effects$.notify(effect);
	}
}
