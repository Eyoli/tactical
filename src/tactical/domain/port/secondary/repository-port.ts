export default interface RepositoryPort<T> {
    getId(): string;
    save(object: T, id: string): void;
    update(object: T, id: string): void;
    load(id: string): T | undefined;
    loadSome(ids: string[]): T[];
    loadAll(): T[];
}