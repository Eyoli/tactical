import Player from "../../domain/model/player";
import Unit from "../../domain/model/unit";
import { injectable } from "inversify";
import TileBasedField from "../../domain/model/tile-based-field/tile-based-field";

export interface JsonMapper<T> {
    fromJson(json: any): T;
    toJson(object: T): any;
}

@injectable()
export class FieldJsonMapper implements JsonMapper<TileBasedField> {

    fromJson(json: any): TileBasedField {
        const field = new TileBasedField(json.name, json.width, json.length, json.height);
        field.id = json.id;
        return field;
    }

    toJson(object: TileBasedField): any {
        return {
            id: object.id,
            name: object.name,
            width: object.width,
            length: object.length,
            height: object.height,
            tiles: object.tiles,
            tileTypes: object.getTileTypes()
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