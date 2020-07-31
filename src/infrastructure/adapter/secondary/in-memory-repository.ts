import Repository from "../../../domain/port/secondary/repository";

export default class InMemoryRepository<T> implements Repository<T> {
    private content: Map<string, T>;

    constructor() {
        this.content = new Map();
    }
    
    update(object: T, id: string): void {
        this.content.set(id, object);
    }

    save(object: T, id: string): void {
        this.content.set(id, object);
    }

    load(id: string): T | undefined {
        return this.content.get(id);
    }

    loadSome(ids: string[]): T[] {
        return Array.from(this.content.entries())
            .filter(entry => ids.includes(entry[0]))
            .map(entry => entry[1]);
    }

    loadAll(): T[] {
        return Array.from(this.content.values());
    }
}