import React from "react";

/**
 * using a React ref as a store in combination with a map
 * to be able to access and modify the store easily
 */
export type Store<T> = React.MutableRefObject<Map<number, T>>

export class Service<T> {

    protected readonly store: Store<T>

    constructor(store: Store<T>) {
        this.store = store
    }

}

// @ts-ignore
export const createStore = <K, T extends Service<K>>(service: typeof T, callback?: (store: Store<K>) => T): T => {
    const store = React.useRef<Map<number, K>>(new Map())
    return (callback ? callback(store) : new service(store)) as T
}