import React from "react";
import {ArrayService} from "./arrayStore";

/**
 * using a React ref as a store in combination with a map
 * to be able to access and modify the store easily
 */
export type ReactiveArrayStore<T> = [T[], React.Dispatch<React.SetStateAction<T[]>>]

export class ReactiveArrayService<T> implements ArrayService<T> {

    protected readonly store: ReactiveArrayStore<T>

    constructor(store: ReactiveArrayStore<T>) {
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

    public update() {
        this.store[1](prevState => [...prevState])
    }

}

// @ts-ignore
export const createReactiveArrayService = <K, T extends ArrayService<K>>(service: typeof T, callback?: (store: ReactiveArrayStore<K>) => T, initial?: K[]): [K[] | undefined, T] => {
    const store = React.useState<K[]>(initial ?? [])
    return [store[0], (callback ? callback(store) : new service(store)) as T]
}