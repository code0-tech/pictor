export interface ArrayService<T> {
    delete(index: number): void
    add(index: T): void
    set(index: number, value: T): void
    has(index: number): boolean
    get(index: number): T
    values(): T[]
    update(): void
}