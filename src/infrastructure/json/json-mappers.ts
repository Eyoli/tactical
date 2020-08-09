import Field from "../../domain/model/field";
import Player from "../../domain/model/player";
import Unit from "../../domain/model/unit";
import { injectable } from "inversify";

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
        unit.jumps = json.jumps;
        unit.moves = json.moves;
        return unit;
    }

    toJson(object: Unit): any {
        return {
            id: object.id,
            name: object.name,
            jumps: object.jumps,
            moves: object.moves
        };
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
        return {
            id: object.id,
            name: object.name
        };
    }
}