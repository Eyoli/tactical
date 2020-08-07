import MissingInputError from "../../error/missing-input-error";

export class CreateFieldRequest {
    name: string;

    constructor(input: any) {
        this.name = input.name;
    }

    validate() {
        if(!this.name) {
            throw new Error("Name is required");
        }
    }
}

export class CreateGameRequest {
    fieldId: string;

    constructor(input: any) {
        this.fieldId = input.fieldId;
    }

    validate() {
        if(!this.fieldId) {
            throw new MissingInputError("fieldId");
        }
    }
}

export class CreatePlayerRequest {
    name!: string;
}

export class CreateUnitRequest {
    name!: string;
}