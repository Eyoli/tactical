import Player from "../../../tactical/domain/model/player";
import Unit from "../../../tactical/domain/model/unit";
import { injectable } from "inversify";
import TileBasedField from "../../../tactical/domain/model/field/tile-based-field";
import JsonMapperPort from "../../port/json-mapper-port";

@injectable()
export class FieldJsonMapper implements JsonMapperPort<TileBasedField> {

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
export class UnitJsonMapper implements JsonMapperPort<Unit> {

    fromJson(json: any): Unit {
        const unit = new Unit()
            .withName(json.name)
            .withStatistics(json.statistics);
        unit.id = json.id;
        return unit;
    }

    toJson(object: Unit): any {
        return {
            id: object.id,
            name: object.name,
            statistics: object.getStatistics()
        };
    }
}

@injectable()
export class PlayerJsonMapper implements JsonMapperPort<Player> {

    fromJson(json: any): Player {
        const player = new Player(json.id, json.name);
        return player;
    }

    toJson(object: Player): any {
        return {
            id: object.id,
            name: object.name
        };
    }
}