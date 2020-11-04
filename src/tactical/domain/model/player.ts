export default class Player {
    id!: string;

    constructor(readonly name: string) {
        this.name = name;
    }

    withId(id: string): Player {
        this.id = id;
        return this;
    }
}