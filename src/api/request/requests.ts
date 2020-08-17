import { UnitsComposition, UnitsPlacement } from "../../tactical/domain/model/aliases";
import Player from "../../tactical/domain/model/player";
import Game from "../../tactical/domain/model/game";
import Position from "../../tactical/domain/model/position";

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

export class StartGameRequest {
    composition: UnitsComposition;

    constructor(input: any) {
        this.composition = new Map();
        for(let playerInfo of input.composition) {
            const unitsPlacement: UnitsPlacement = new Map();
            for(let unitInfo of playerInfo.units) {
                unitsPlacement.set(unitInfo.unitId, new Position(unitInfo.position.x, unitInfo.position.y));
            }
            this.composition.set(playerInfo.playerId, unitsPlacement);
        }
    }
}