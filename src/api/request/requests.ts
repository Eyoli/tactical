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
        const warnings = [];
        if(!this.name) {
            warnings.push("name is required");
        }
        return warnings;
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

    validate(): string[] {
        const warnings = [];
        if(!this.fieldId) {
            warnings.push("fieldId is required");
        }
        return warnings;
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

    validate(): string[] {
        const warnings = [];
        if(!this.name) {
            warnings.push("name is required");
        }
        return warnings;
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

    validate(): string[] {
        const warnings = [];
        if(!this.name) {
            warnings.push("name is required")
        }
        if(!this.moves) {
            warnings.push("moves is required")
        }
        if(!this.jumps) {
            warnings.push("jumps is required")
        }
        return warnings;
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