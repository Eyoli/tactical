import IdGenerator from "../port/id-generator";

export default class CounterIdGenerator implements IdGenerator<string> {
    private counter = 1;
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    generate(): string {
        const id = this.prefix + this.counter;
        this.counter++;
        return id;
    }
}