import Field from "../../domain/model/field";
import Game from "../../domain/model/game";
import Player from "../../domain/model/player";
import Unit from "../../domain/model/unit";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import Repository from "../../domain/port/secondary/repository";

export interface JsonMapper<T> {
    fromJson(json: any): T;
    toJson(object: T): any;
}

@injectable()
export class FieldJsonMapper implements JsonMapper<Field> {

    fromJson(json: any): Field {
        const field = new Field(json.name);
        field.id = json.id;
        return field;
    }

    toJson(object: Field): any {
        return {
            id: object.id,
            name: object.name
        };
    }
}

@injectable()
export class UnitJsonMapper implements JsonMapper<Unit> {

    fromJson(json: any): Unit {
        const unit = new Unit(json.name);
        unit.id = json.id;
        return unit;
    }

    toJson(object: Unit): any {
        return {};
    }
}

@injectable()
export class GameJsonMapper implements JsonMapper<Game> {
    private playerRepository: Repository<Player>;

    constructor(@inject(TYPES.PLAYER_REPOSITORY) playerRepository: Repository<Player>) {
        this.playerRepository = playerRepository;
    }

    fromJson(json: any): Game {
        const game = new Game();
        game.id = json.id;
        return game;
    }

    toJson(object: Game): any {
        return {};
    }
}

@injectable()
export class PlayerJsonMapper implements JsonMapper<Player> {

    fromJson(json: any): Player {
        const player = new Player(json.name);
        player.id = json.id;
        return player;
    }

    toJson(object: Player): any {
        return {};
    }
}