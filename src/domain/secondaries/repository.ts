export default interface Repository<T> {
    save(object: T, key: string): void;
    load(key: string): T | undefined;
    loadAll(): T[];
}