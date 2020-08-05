export default class ResourceNotFoundError<T> extends Error {

    constructor(constructor: {
        new (...args: any[]): T;
    }) {
        super(constructor.name + " not found");
    } 
}