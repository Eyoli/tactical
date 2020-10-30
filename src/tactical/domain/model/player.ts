export default class Player {
    id!: string;

    constructor(readonly name: string) {
        this.name = name;
    }
}