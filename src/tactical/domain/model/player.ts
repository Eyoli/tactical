export default class Player {
    readonly id!: string;
    readonly name: string;

    constructor(name: string, id?: string) {
        this.name = name;
        if (id) {
            this.id = id;
        }
    }

    withId(id: string): Player {
        return new Player(this.name, id);
    }
}