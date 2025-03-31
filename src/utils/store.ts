import React from "react";

/**
 * using a React ref as a store in combination with a map
 * to be able to access and modify the store easily
 */
export type Store<T> = [T[], React.Dispatch<React.SetStateAction<T[]>>]

export class Service<T> {

    protected readonly store: Store<T>

    constructor(store: Store<T>) {
        this.store = store
    }

    public delete(index: number) {
        this.store[1](prevState => {
            const newState = prevState.filter((value, index1) => index1 !== index);
            return [
                ...newState,
            ]
        })
    }

    public add(value: T) {
        this.store[1](prevState => {
            return [
                ...prevState,
                value
            ]
        })
    }

    public set(index: number, value: T) {
        this.store[1](prevState => {
            prevState[index] = value
            return [
                ...prevState
            ]
        })
    }

    public has(index: number) {
        return !!this.store[0][index]
    }

    public get(index: number) {
        return this.store[0][index]
    }

    public values() {
        return this.store[0]
    }

}

// @ts-ignore
export const createService = <K, T extends Service<K>>(service: typeof T, callback?: (store: Store<K>) => T, initial?: K[]): [K[] | undefined, T] => {
    const store = React.useState<K[]>(initial ?? [])
    return [store[0], (callback ? callback(store) : new service(store)) as T]
}