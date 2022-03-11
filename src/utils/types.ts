export interface Subscription {
    unsubscribe: () => void;
}

export interface Observable<T = void> {
    subscribe(observer: Observer<T>): Subscription;
    notify(value: T): void;
}

export interface Observer<T = void> {
    update(value: T): void;
}

export type Loading<M = undefined> = {
    error?: undefined;
    value?: undefined;
    meta: M;
};

export type Success<V = undefined, M = undefined> = {
    value: V;
    meta: M;
    error?: undefined;
};

export type Failure<E extends Error | undefined = undefined, M = undefined> = {
    error: E;
    meta: M;
    value?: undefined;
};

export type Catalog = Record<string, string>;
export type Placeholders = Record<string, ((text: string) => string) | string | number>;