import TileBasedField from "../../tactical/domain/model/tile-based-field/tile-based-field";
import Tile from "../../tactical/domain/model/tile-based-field/tile";
import TileType from "../../tactical/domain/model/tile-based-field/tile-type";

export default class FieldDTO {
    name: string;
    width: number;
    length: number;
    height: number;
    tiles: any;
    tileTypes: TileType[];

    constructor(field: TileBasedField) {
        this.name = field.name;
        this.width = field.width;
        this.length = field.length;
        this.height = field.height;
        this.tiles = field.tiles;
        this.tileTypes = field.getTileTypes()
    }
}