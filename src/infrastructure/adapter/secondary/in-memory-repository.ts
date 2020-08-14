import RepositoryPort from "../../../domain/port/secondary/repository";

export default class InMemoryRepository<T> implements RepositoryPort<T> {
    private content: Map<string, T>;
    private counter = 1;

    constructor() {
        this.content = new Map();
    }
    
    update(object: T, id: string): void {
        this.content.set(id, object);
    }

    save(object: T): string {
        const id = "object" + this.counter;
        this.counter++;
        this.content.set(id, object);
        return id;
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