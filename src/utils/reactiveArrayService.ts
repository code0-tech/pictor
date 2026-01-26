import React, {startTransition} from "react";
import {ArrayService} from "./arrayService";
import {Payload, View} from "./view";

export type ReactiveArrayStore<T> = {
    getState: () => T[];
    setState: React.Dispatch<React.SetStateAction<T[]>>;
};

export class ReactiveArrayService<T extends Payload, D = Record<string, any>> implements ArrayService<View<T>, T, D> {
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
        return this.access.getState()[index]?.payload;
    }

    values(_dependencies?: D) {
        return this.access.getState().map(view => view.payload)
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

type ArrayServiceCtor<I, R, S extends ArrayService<I, R>> =
    new (access: ReactiveArrayStore<I>) => S

type InitialArg<R> = R[]

export function useReactiveArrayService<
    R extends Payload,
    S extends ArrayService<View<R>, R>
>(
    Ctor: ArrayServiceCtor<View<R>, R, S> | ((store: ReactiveArrayStore<View<R>>) => S),
    initial: InitialArg<R> = []
): [View<R>[], S] {

    const [state, setState] = React.useState<View<R>[]>([])
    const stateRef = React.useRef<View<R>[]>([])

    stateRef.current = state

    const getState = React.useCallback(() => stateRef.current, [])

    const service = React.useMemo(() => {
        const store: ReactiveArrayStore<View<R>> = { getState, setState }

        const handler = { construct: () => handler }
        const isConstructor = (x: any) => {
            try {
                return !!new (new Proxy(x, handler))()
            } catch {
                return false
            }
        }

        return isConstructor(Ctor)
            ? new (Ctor as ArrayServiceCtor<View<R>, R, S>)(store)
            : (Ctor as (store: ReactiveArrayStore<View<R>>) => S)(store)
    }, [Ctor, getState])

    const createView = React.useCallback((payload: R): View<R> => {
        return new View(payload)
    }, [])

    const didInit = React.useRef(false)
    React.useEffect(() => {
        if (didInit.current) return
        didInit.current = true

        service.clear()
        initial.forEach((raw) => {
            service.add(createView(raw))
        })
    }, [service, initial, createView])

    return [state, service]
}