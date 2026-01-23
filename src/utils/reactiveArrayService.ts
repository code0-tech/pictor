import React, {startTransition} from "react";
import {ArrayService} from "./arrayService";
import {Payload, View} from "./view";

export type ReactiveArrayStore<T> = {
    getState: () => T[];
    setState: React.Dispatch<React.SetStateAction<T[]>>;
};

export class ReactiveArrayService<T extends Payload, D = Record<string, any>> implements ArrayService<View<T>, D> {
    protected readonly access: ReactiveArrayStore<View<T>>;

    constructor(access: ReactiveArrayStore<View<T>>) {
        this.access = access;
    }

    delete(index: number) {
        startTransition(() => {
            this.access.setState(prev => prev.filter((_, i) => i !== index));
        })
    }

    add(value: View<T>) {
        startTransition(() => {
            this.access.setState(prev => [...prev, value]);
        })
    }

    set(index: number, value: View<T>) {
        startTransition(() => {
            this.access.setState(prev => {
                const next = prev.slice();
                next[index] = value;
                return next;
            });
        })
    }

    has(index: number) {
        const arr = this.access.getState();
        return index >= 0 && index < arr.length;
    }

    get(index: number) {
        return this.access.getState()[index];
    }

    values(_dependencies?: D): View<T>[] {
        return this.access.getState();
    }

    update() {
        startTransition(() => {
            this.access.setState(prev => [...prev]);
        })
    }

    clear() {
        startTransition(() => {
            this.access.setState(() => []);
        })
    }
}

type ArrayServiceCtor<K, S extends ArrayService<K>> =
    new (access: ReactiveArrayStore<K>) => S;

type InitialArg<K, S extends ArrayService<K>> = K[] | ((svc: S) => K[]);

export function useReactiveArrayService<K, S extends ArrayService<K>>(
    Ctor: ArrayServiceCtor<K, S> | ((store: ReactiveArrayStore<K>) => S),
    initial: InitialArg<K, S> = []
): [K[], S] {
    const [state, setState] = React.useState<K[]>(
        Array.isArray(initial) ? initial : []
    );

    const ref = React.useRef(state);
    React.useEffect(() => {
        ref.current = state;
    }, [state]);

    const getState = React.useCallback(() => ref.current, []);

    const service = React.useMemo(() => {
        const store = {getState, setState};

        const handler = {
            construct() {
                return handler
            }
        }

        const isConstructor = (x: any) => {
            try {
                return !!(new (new Proxy(x, handler))())
            } catch (e) {
                return false
            }
        }

        return isConstructor(Ctor)
            ? new (Ctor as ArrayServiceCtor<K, S>)(store) // Klasse → mit new
            : (Ctor as (store: ReactiveArrayStore<K>) => S)(store); // Factory → direkt aufrufen
    }, [Ctor, getState, setState]);

    React.useEffect(() => {
        if (typeof initial === "function") {
            setState((initial as (svc: S) => K[])(service));
        }
    }, [service, initial]);

    return [state, service];
}