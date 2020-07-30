import Repository from "../domain/secondaries/repository";

export default class InMemoryRepository<T> implements Repository<T> {
    private maps: Map<string, T>;

    constructor() {
        this.maps = new Map();
    }

    loadAll(): T[] {
        return Array.from(this.maps.values());
    }

    save(object: T, key: string): void {
        this.maps.set(key, object);
    }

    load(key: string): T | undefined {
        return this.maps.get(key);
    }
}