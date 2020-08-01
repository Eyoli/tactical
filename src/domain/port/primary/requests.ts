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
    name!: string;
}

export class CreatePlayerRequest {
    name!: string;
}

export class CreateUnitRequest {
    name!: string;
}