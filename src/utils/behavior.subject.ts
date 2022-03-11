import { Subject } from "./subject";

export class BehaviorSubject<T> extends Subject<T> {
    constructor(public value: T) {
        super();
    }

    public notify(value: T) {
        this.value = value;
        super.notify(value);
    }
}
