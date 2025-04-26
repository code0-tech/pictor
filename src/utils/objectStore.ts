import React from "react";

/**
 * using a React ref as a store in combination with a map
 * to be able to access and modify the store easily
 */
export type ObjectStore<K> = [K | undefined, React.Dispatch<React.SetStateAction<K>>]

export class ObjectService<K> {

    protected readonly store: ObjectStore<K>

    constructor(store: ObjectStore<K>) {
        this.store = store
    }

    public object(): K | undefined {
        return this.store[0]
    }

}

// @ts-ignore
export const createObjectService = <K, T extends ObjectService<K>>(service: typeof T, callback?: (store: ObjectStore<K>) => T, initial?: K): [K | undefined, T] => {
    const store = React.useState<K | undefined>(initial)
    return [store[0], (callback ? callback(store) : new service(store)) as T]
}