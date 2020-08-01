import { CreateFieldRequest } from "../port/primary/requests";

export default class Field {
    id?: string;
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    static fromCreateRequest(createFieldRequest: CreateFieldRequest) {
        const field = new Field(createFieldRequest.name);
        return field;
    }
}