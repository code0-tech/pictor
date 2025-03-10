import React from "react";

export type Store<T> = [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]

export class Service<T> {

    protected readonly store: Store<T>

    constructor(store: Store<T>) {
        this.store = store
    }

}

export const createStore = <T>(service: typeof Service<T>): Service<T> => {
    const state = React.useState<T>()
    return new service(state)
}