export default class ResourceNotFoundError<T> extends Error {

    static fromClass<T>(constructor: {
        new (...args: any[]): T;
    }) {
        return new ResourceNotFoundError<T>(constructor.name);
    }

    constructor(name: string) {
        super(name + " not found");
    }
}