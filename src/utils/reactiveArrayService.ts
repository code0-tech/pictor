// reactiveArrayService.ts
import React from "react";
import { ArrayService } from "./arrayService";

// Zugriffstyp: aktueller State via Getter, Updates via setState
export type ReactiveArrayStore<T> = {
    getState: () => T[];
    setState: React.Dispatch<React.SetStateAction<T[]>>;
};

export class ReactiveArrayService<T> implements ArrayService<T> {
    protected readonly access: ReactiveArrayStore<T>;
    constructor(access: ReactiveArrayStore<T>) {
        this.access = access;
    }

    delete(index: number) {
        this.access.setState(prev => prev.filter((_, i) => i !== index));
    }

    add(value: T) {
        this.access.setState(prev => [...prev, value]);
    }

    set(index: number, value: T) {
        this.access.setState(prev => {
            const next = prev.slice();
            next[index] = value;
            return next;
        });
    }

    has(index: number) {
        return !!this.access.getState()[index];
    }

    get(index: number) {
        return this.access.getState()[index];
    }

    values() {
        return this.access.getState();
    }

    update() {
        this.access.setState(prev => prev.slice());
    }

    clear() {
        this.access.setState(() => []);
    }
}

export function useReactiveArrayService<K, S extends ArrayService<K>>(
    // @ts-ignore
    Ctor: typeof S,
    initial: K[] = []
): [K[], S] {
    const [state, setState] = React.useState<K[]>(initial);
    const ref = React.useRef(state);
    React.useEffect(() => { ref.current = state; }, [state]);
    const getState = React.useCallback(() => ref.current, []);
    const service = React.useMemo(() => new Ctor({ getState, setState }), [Ctor, getState, setState]);
    return [state, service];
}