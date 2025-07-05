import React, { createContext, useContext, ReactNode, useMemo } from "react";

/**
 * Type for a service class constructor.
 */
export type ServiceConstructor<T> = new (...args: any[]) => T;

/**
 * Tuple type representing a store and its associated service instance.
 */
export type ServiceEntry<T = any> = [any, T];

/**
 * Map type for storing service entries by their constructor function.
 */
export type ServiceMap = Map<Function, ServiceEntry>;

/**
 * React Context to hold the service map.
 */
export const ContextStore = createContext<ServiceMap | null>(null);

/**
 * Props for the ContextStoreProvider component.
 * @property services - Array of [store, service] tuples to provide.
 * @property children - React children nodes.
 */
export type ContextStoreProviderProps = {
    services: ServiceEntry[];
    children: ReactNode;
};

/**
 * ContextStoreProvider component.
 * Provides a context with all given services and their stores.
 * @param services - Array of [store, service] tuples.
 * @param children - React children nodes.
 */
export const ContextStoreProvider: React.FC<ContextStoreProviderProps> = ({ services, children }) => {
    // Memoize the service map to avoid unnecessary recalculations.
    const map = useMemo(() => {
        const m: ServiceMap = new Map();
        services.forEach(([store, service]) => {
            // Use the service's constructor as the key.
            m.set(service.constructor, [store, service]);
        });
        return m;
    }, [services]);
    return <ContextStore.Provider value={map}>{children}</ContextStore.Provider>;
};

/**
 * Hook to retrieve a service instance from the context by its class.
 * @param ServiceClass - The class of the service to retrieve.
 * @returns The service instance.
 * @throws If the context or service is not found.
 */
export const useService = <T,>(ServiceClass: ServiceConstructor<T>): T => {
    const ctx = useContext(ContextStore);
    if (!ctx) throw new Error("ContextStore not found");
    const entry = ctx.get(ServiceClass);
    if (!entry) throw new Error("Service not found");
    return entry[1] as T;
};

/**
 * Hook to retrieve a store from the context by its service class.
 * @param ServiceClass - The class of the service whose store to retrieve.
 * @returns The store associated with the service.
 * @throws If the context or service is not found.
 */
export const useStore = <T,>(ServiceClass: ServiceConstructor<T>): any => {
    const ctx = useContext(ContextStore);
    if (!ctx) throw new Error("ContextStore not found");
    const entry = ctx.get(ServiceClass);
    if (!entry) throw new Error("Service not found");
    return entry[0];
};