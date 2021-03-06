import Field from "../field";
import Position from "../position";
import TileType from "./tile-type";
import UnitState from "../unit-state";

export default class TileBasedField extends Field {
    private tileTypes: Map<number, TileType>;
    readonly tiles: number[][][] = [];
    readonly width: number;
    readonly length: number;
    readonly height: number;

    constructor(name: string, width: number, length: number, height: number) {
        super(name);
        this.width = width;
        this.length = length;
        this.height = height;
        this.tileTypes = new Map();
    }

    withTiles(...lines: number[][][]) {
        this.tiles.push(...lines);
        return this;
    }

    withTileTypes(...tileTypes: TileType[]) {
        for (let tileType of tileTypes) {
            this.tileTypes.set(tileType.type, tileType);
        }
        return this;
    }

    getTileTypes(): TileType[] {
        return Array.from(this.tileTypes.values());
    }

    getNeighbours(p: Position): Position[] {
        const neighbours: Position[] = [];
        if (p.x > 0 && p.y < this.tiles[p.x - 1].length) {
            neighbours.push(new Position(p.x - 1, p.y, this.tiles[p.x - 1][p.y].length - 1));
        }
        if (p.x < this.tiles.length - 1 && p.y < this.tiles[p.x + 1].length) {
            neighbours.push(new Position(p.x + 1, p.y, this.tiles[p.x + 1][p.y].length - 1));
        }
        if (p.y > 0) {
            neighbours.push(new Position(p.x, p.y - 1, this.tiles[p.x][p.y - 1].length - 1));
        }
        if (p.y < this.tiles[p.x].length - 1) {
            neighbours.push(new Position(p.x, p.y + 1, this.tiles[p.x][p.y + 1].length - 1));
        }
        return neighbours;
    }

    getCost(p: Position): number {
        return this.tileTypes.get(this.tiles[p.x][p.y][p.z])!.cost;
    }

    isValidPosition(p: Position): boolean {
        return p.x >= 0 && p.x < this.tiles.length
            && p.y >= 0 && p.y < this.tiles[p.x].length
            && p.z === this.tiles[p.x][p.y].length - 1;
    }
    
    getHeightDifference(p1: Position, p2: Position): number {
        return Math.abs(p1.z - p2.z);
    }
}