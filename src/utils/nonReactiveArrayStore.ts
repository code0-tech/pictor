import {ArrayService} from "./arrayStore";

/**
 * using a React ref as a store in combination with a map
 * to be able to access and modify the store easily
 */
export type NonReactiveArrayStore<K> = K[]

export class NonReactiveArrayService<T> implements ArrayService<T> {

    protected store: NonReactiveArrayStore<T>

    constructor(store: NonReactiveArrayStore<T>) {
        this.store = store
    }

    public delete(index: number) {
        delete this.store[index]
    }

    public add(value: T) {
        this.store.push(value)
    }

    public set(index: number, value: T) {
        this.store[index] = value
    }

    public has(index: number) {
        return !!this.store[index]
    }

    public get(index: number) {
        return this.store[index]
    }

    public values() {
        return this.store
    }

    public update() {
        this.store = [...this.store]
    }

    clear(): void {
        this.store = []
    }

}

// @ts-ignore
export const createNonReactiveArrayService = <K, T extends ArrayService<K>>(service: typeof T, callback?: (store: NonReactiveArrayStore<K>) => T): [K[] | undefined, T] => {
    const store: NonReactiveArrayStore<K> = []
    return [store, (callback ? callback(store) : new service(store)) as T]
}