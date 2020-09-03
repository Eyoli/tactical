import TileType from "../../tactical/domain/model/tile-based-field/tile-type";
import Tile from "../../tactical/domain/model/tile-based-field/tile";
import TileBasedField from "../../tactical/domain/model/tile-based-field/tile-based-field";
import Field from "../../tactical/domain/model/field";

export default class CreateFieldRequest {
    private name: string;
    private tileTypes: TileType[] = [];
    private tiles: number[][][] = [];
    private width: number;
    private length: number;
    private height: number;

    constructor(input: any) {
        this.name = input.name;
        for (let tileType of input.tileTypes) {
            this.tileTypes.push(new TileType(tileType.type, tileType.cost, tileType.src, tileType.liquid));
        }
        this.tiles = input.tiles;
        this.width = this.tiles.length;
        this.length = this.tiles[0].length;
        this.height = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.length; j++) {
                if (this.height < this.tiles[i][j].length) {
                    this.height = this.tiles[i][j].length;
                }
            }
        }
    }

    validate() {
        const warnings = [];
        if(!this.name) {
            warnings.push("name is required");
        }
        return warnings;
    }

    toField(): TileBasedField {
        return new TileBasedField(this.name, this.width, this.length, this.height)
            .withTileTypes(...this.tileTypes)
            .withTiles(...this.tiles);
    }
}