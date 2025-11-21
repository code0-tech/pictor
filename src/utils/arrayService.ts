export interface ArrayService<T, D = Record<string, any>> {
    delete(index: number): void
    add(index: T): void
    set(index: number, value: T): void
    has(index: number): boolean
    get(index: number): T
    values(dependencies?: D): T[]
    update(): void
    clear(): void
}