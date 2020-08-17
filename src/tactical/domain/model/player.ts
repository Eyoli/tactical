import { CreatePlayerRequest } from "../../../api/request/requests";

export default class Player {
    id!: string;
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    withId(id: string): Player {
        this.id = id;
        return this;
    }
}