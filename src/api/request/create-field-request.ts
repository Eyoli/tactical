import TileType from "../../tactical/domain/model/field/tile-type";
import TileBasedField from "../../tactical/domain/model/field/tile-based-field";
import Position from "../../tactical/domain/model/position";

export default class CreateFieldRequest {
    private name: string;
    private tileTypes: TileType[] = [];
    private tiles: number[][][] = [];
    private width: number;
    private length: number;
    private height: number;
    private offset: Position;

    constructor(input: any) {
        this.name = input.name;
        for (const tileType of input.tileTypes) {
            this.tileTypes.push(new TileType(tileType.type, tileType.cost, tileType.src, tileType.liquid));
        }
        this.width = input.tiles.length;
        this.length = input.tiles[0].length;
        this.height = 0;
        for (let i = 0; i < input.tiles.length; i++) {
            const row = [];
            for (let j = 0; j < input.tiles[i].length; j++) {
                const pile = [];
                for (let k = 0; k < input.tiles[i][j].length; k += 2) {
                    for (let l = 0; l < input.tiles[i][j][k + 1]; l++) {
                        pile.push(input.tiles[i][j][k]);
                    }
                }
                if (this.height < pile.length) {
                    this.height = pile.length;
                }
                row.push(pile);
            }
            this.tiles.push(row);
        }
        this.offset = input.offset;
    }

    validate(): string[] {
        const warnings = [];
        if (!this.name) {
            warnings.push("name is required");
        }
        return warnings;
    }

    toField(): TileBasedField {
        return new TileBasedField(this.name, this.width, this.length, this.height, this.offset)
            .withTileTypes(...this.tileTypes)
            .withTiles(...this.tiles);
    }
}