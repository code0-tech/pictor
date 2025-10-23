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
        const arr = this.access.getState();
        return index >= 0 && index < arr.length;
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

// Hilfstyp für den Konstruktor des Service
type ArrayServiceCtor<K, S extends ArrayService<K>> =
    new (access: ReactiveArrayStore<K>) => S;

// initial kann Array oder Callback sein
type InitialArg<K, S extends ArrayService<K>> = K[] | ((svc: S) => K[]);

export function useReactiveArrayService<K, S extends ArrayService<K>>(
    Ctor: ArrayServiceCtor<K, S>,
    initial: InitialArg<K, S> = []
): [K[], S] {
    // 1) State + Ref
    const [state, setState] = React.useState<K[]>(
        Array.isArray(initial) ? initial : [] // Platzhalter; Callback folgt in Effect
    );
    const ref = React.useRef(state);
    React.useEffect(() => { ref.current = state; }, [state]);

    // 2) stabiler Getter
    const getState = React.useCallback(() => ref.current, []);

    // 3) Service erstellen (stabil über getState/setState)
    const service = React.useMemo(() => new Ctor({ getState, setState }), [Ctor, getState, setState]);

    // 4) Falls initial ein Callback ist, einmalig ausführen, sobald Service existiert
    React.useEffect(() => {
        if (typeof initial === "function") {
            // Nur einmal setzen (überschreibt ggf. den Platzhalter)
            setState((initial as (svc: S) => K[])(service));
        }
        // absichtlich keine Abhängigkeit auf `state` – nur einmal ausführen
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [service]);

    return [state, service];
}