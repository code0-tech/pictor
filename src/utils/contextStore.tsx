import React, { createContext, useContext, ReactNode, useMemo } from "react";

/**
 * Type representing a concrete class constructor.
 */
export type ConcreteCtor<T> = new (...args: any[]) => T;

/**
 * Type representing an abstract class constructor.
 */
export type AbstractCtor<T> = abstract new (...args: any[]) => T;

/**
 * A class constructor type that can be either concrete or abstract.
 */
export type ServiceClass<T> = ConcreteCtor<T> | AbstractCtor<T>;

/**
 * Tuple representing a service entry: [store, service].
 */
export type ServiceEntry<T = any> = [any, T];

/**
 * Map storing service entries, keyed by their (abstract or concrete) class constructor.
 */
export type ServiceMap = Map<Function, ServiceEntry>;

/**
 * React Context for providing and consuming registered services and stores.
 */
export const ContextStore = createContext<ServiceMap | null>(null);

/**
 * Props for the ContextStoreProvider component.
 * @property services - Array of [store, service] tuples to register.
 * @property children - React children to render within the provider.
 */
export type ContextStoreProviderProps = {
    services: ServiceEntry[];
    children: ReactNode;
};

/**
 * Traverses the prototype chain of an object and returns all constructors found.
 * Example: Bla -> DOrganizationReactiveService -> DOrganizationService -> ReactiveArrayService -> ...
 *
 * @param obj - The object whose prototype chain should be inspected.
 * @returns An array of constructor functions representing the prototype chain.
 */
function getPrototypeChainCtors(obj: object): Function[] {
    const ctors: Function[] = [];
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto.constructor && proto !== Object.prototype) {
        const ctor = proto.constructor as Function;
        ctors.push(ctor);
        proto = Object.getPrototypeOf(proto);
    }
    return ctors;
}

/**
 * ContextStoreProvider
 *
 * Registers all given services and their associated stores in a shared context.
 *
 * Each service is indexed by both its concrete constructor and all abstract or
 * base class constructors in its prototype chain.
 *
 * If multiple services share the same base class, the first one wins (no overwriting).
 */
export const ContextStoreProvider: React.FC<ContextStoreProviderProps> = ({ services, children }) => {
    const map = useMemo(() => {
        const m: ServiceMap = new Map();

        services.forEach(([store, service]) => {
            const concreteCtor = service.constructor as Function;

            // 1) Register the concrete class itself
            if (!m.has(concreteCtor)) {
                m.set(concreteCtor, [store, service]);
            }

            // 2) Register all base class constructors in the prototype chain
            const baseCtors = getPrototypeChainCtors(service);
            for (const baseCtor of baseCtors) {
                if (!m.has(baseCtor)) {
                    m.set(baseCtor, [store, service]);
                }
            }
        });

        return m;
    }, [services]);

    return <ContextStore.Provider value={map}>{children}</ContextStore.Provider>;
};

/**
 * Retrieves a service instance from the ContextStore by its class.
 * Works with both concrete classes and abstract base classes.
 *
 * @param ServiceClass - The (abstract or concrete) class of the desired service.
 * @returns The matching service instance.
 * @throws If the context or service cannot be found.
 */
export const useService = <T,>(ServiceClass: ServiceClass<T>): T => {
    const ctx = useContext(ContextStore);
    if (!ctx) throw new Error("ContextStore not found");

    const entry = ctx.get(ServiceClass as unknown as Function);
    if (!entry) {
        const name = (ServiceClass as any)?.name ?? "UnknownServiceClass";
        throw new Error(`Service not found for ${name}`);
    }
    return entry[1] as T;
};

/**
 * Retrieves the store associated with a (concrete or abstract) service class.
 *
 * @param ServiceClass - The (abstract or concrete) class whose store should be retrieved.
 * @returns The store instance associated with the given service.
 * @throws If the context or store cannot be found.
 */
export const useStore = <T,>(ServiceClass: ServiceClass<T>): any => {
    const ctx = useContext(ContextStore);
    if (!ctx) throw new Error("ContextStore not found");

    const entry = ctx.get(ServiceClass as unknown as Function);
    if (!entry) {
        const name = (ServiceClass as any)?.name ?? "UnknownServiceClass";
        throw new Error(`Store not found for ${name}`);
    }
    return entry[0];
};