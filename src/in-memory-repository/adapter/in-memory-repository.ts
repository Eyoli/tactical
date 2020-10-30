import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import Logger from "../../tactical/domain/logger/logger";
import IdGenerator from "../port/id-generator";

// eslint-disable-next-line @typescript-eslint/ban-types
export default class InMemoryRepository<T extends Object> implements RepositoryPort<T> {
    private idGenerator: IdGenerator<string>;
    private content: Map<string, T>;

    constructor(idGenerator: IdGenerator<string>) {
        this.idGenerator = idGenerator;
        this.content = new Map();
    }

    getId(): string {
        return this.idGenerator.generate();
    }

    update(object: T, id: string): void {
        this.content.set(id, object);
    }

    save(object: T, id: string): string {
        this.content.set(id, object);
        return id;
    }

    load(id: string): T | undefined {
        const object = this.content.get(id);
        Logger.log(() => "load " + object?.constructor.name + " : " + id + " from memory");
        return object;
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