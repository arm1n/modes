import type { Observable, Observer } from "./types";

export class Subject<T> implements Observable<T> {
    private observers: Observer<T>[] = [];

    public subscribe(observer: Observer<T>) {
        this.observers.push(observer);

        return {
            unsubscribe: () => {
                this.observers = this.observers.filter(
                    (current) => current !== observer
                );
            },
        };
    }

    public notify(value: T) {
        this.observers.forEach((observer) => observer.update(value));
    }
}
