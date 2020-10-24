export default class Builder<T> {
    private readonly properties: Map<string, unknown> = new Map();

    copy(instance: T): Builder<T> {
        const object: any = instance;
        for (const prop in object) {
            this.properties.set(prop, object[prop]);
        }
        return this;
    }

    with(name: string, value: unknown): Builder<T> {
        this.properties.set(name, value);
        return this;
    }

    build(): T {
        const object: any = {};
        for (const prop of this.properties.entries()) {
            object[prop[0]] = prop[1];
        }
        return object;
    }
}