interface Newable<T> {
    new (...args: any[]): T;
}
interface Abstract<T> {
    prototype: T;
}
type ClassIdentifier<T> = Newable<T> | Abstract<T>;

export default class ResourceNotFoundError extends Error {

    static fromClass<T>(identifier: ClassIdentifier<T>): ResourceNotFoundError {
        return new ResourceNotFoundError(identifier.constructor.name);
    }

    constructor(name: string) {
        super(name + " not found");
    }
}