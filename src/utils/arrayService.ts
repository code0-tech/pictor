export interface ArrayService<I, R, D = Record<string, any>> {
    delete(index: number): void
    add(index: I): void
    set(index: number, value: I): void
    has(index: number): boolean
    get(index: number): R
    values(dependencies?: D): R[]
    update(): void
    clear(): void
}