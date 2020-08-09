import MissingInputError from "../error/missing-input-error";
import { UnitsComposition, UnitsPlacement } from "../../domain/model/aliases";
import Player from "../../domain/model/player";
import Game from "../../domain/model/game";
import Field from "../../domain/model/field";
import Unit from "../../domain/model/unit";

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

    toField(): Field {
        const field = new Field(this.name);
        return field;
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

    toGame(): Game {
        const game = new Game();
        return game;
	}
}

export class CreatePlayerRequest {
    name!: string;

    constructor(input: any) {
        this.name = input.name;
    }

    validate() {
        if(!this.name) {
            throw new MissingInputError("name");
        }
    }

    toField(): Player {
        const player = new Player(this.name);
        return player;
    }
}

export class CreateUnitRequest {
    name!: string;
    moves!: number;
    jumps!: number;

    constructor(input: any) {
        this.name = input.name;
        this.moves = input.moves;
        this.jumps = input.jumps;
    }

    validate() {
        if(!this.name) {
            throw new MissingInputError("name");
        }
        if(!this.moves) {
            throw new MissingInputError("moves");
        }
        if(!this.jumps) {
            throw new MissingInputError("jumps");
        }
    }

    toUnit(): Unit {
        const unit = new Unit(this.name)
            .withJumps(this.jumps)
            .withMoves(this.moves);
        return unit;
    }
}

export class StartGameRequest {
    composition: UnitsComposition;

    constructor(input: any) {
        this.composition = new Map();
        for(let playerInfo of input.composition) {
            const unitsPlacement: UnitsPlacement = new Map();
            for(let unitInfo of playerInfo.units) {
                unitsPlacement.set(unitInfo.unitId, unitInfo.position);
            }
            this.composition.set(playerInfo.playerId, unitsPlacement);
        }
    }
}