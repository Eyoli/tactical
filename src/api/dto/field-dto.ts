import TileBasedField from "../../tactical/domain/model/field/tile-based-field";
import TileType from "../../tactical/domain/model/field/tile-type";
import Position from "../../tactical/domain/model/position";

export default class FieldDTO {
    name: string;
    width: number;
    length: number;
    height: number;
    tiles: any;
    tileTypes: TileType[];
    offset: Position;

    constructor(field: TileBasedField) {
        this.name = field.name;
        this.width = field.width;
        this.length = field.length;
        this.height = field.height;
        this.tiles = field.tiles;
        this.offset = field.offset;
        this.tileTypes = field.getTileTypes()
    }
}