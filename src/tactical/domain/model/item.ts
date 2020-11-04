export default class Item {
    id!: string;

    constructor(
        readonly name: string,
        readonly linkedId: string,
        readonly img: string,
        readonly max = 1,
        readonly use = false,
        readonly remove = true) {
    }

    withId(id: string): Item {
        this.id = id;
        return this;
    }
}