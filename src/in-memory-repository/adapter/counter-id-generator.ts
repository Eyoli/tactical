import IdGenerator from "../port/id-generator";

export default class CounterIdGenerator<T> implements IdGenerator<T, string> {
    private counter: number = 1;
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    generate(object: T): string {
        const id = this.prefix + this.counter;
        this.counter++;
        return id;
    }
}