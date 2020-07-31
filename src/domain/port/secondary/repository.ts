export default interface Repository<T> {
    update(object: T, id: string): void;
    save(object: T, id: string): void;
    load(id: string): T | undefined;
    loadSome(ids: string[]): T[];
    loadAll(): T[];
}