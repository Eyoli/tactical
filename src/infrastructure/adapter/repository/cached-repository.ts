import RepositoryPort from "../../../tactical/domain/port/secondary/repository";
import Logger from "../../../tactical/domain/logger/logger";

export default class CachedRepository<T extends Object> implements RepositoryPort<T> {
    private repository: RepositoryPort<T>;
    private cache: Map<string, T>;

    constructor(repository: RepositoryPort<T>) {
        this.repository = repository;
        this.cache = new Map();
    }

    update(object: T, id: string): void {
        this.cache.delete(id);
        Logger.log(() => "remove " + object?.constructor.name + " : " + id + " from cache");
        this.repository.update(object, id);
    }

    save(object: T): string {
        return this.repository.save(object);
    }

    load(id: string): T | undefined {
        const cachedObject = this.cache.get(id);
        if (cachedObject) {
            Logger.log(() => "load " + cachedObject?.constructor.name + " : " + id + " from cache");
            return cachedObject;
        }
        const object = this.repository.load(id);
        if (object) {
            Logger.log(() => "save " + object?.constructor.name + " : " + id + " in cache");
            this.cache.set(id, object);
        }
        return object;
    }

    loadSome(ids: string[]): T[] {
        return this.repository.loadSome(ids);
    }

    loadAll(): T[] {
        return this.repository.loadAll();
    }

}