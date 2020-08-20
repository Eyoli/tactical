import Field from "../field";
import Position from "../position";
import TileType from "./tile-type";

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
        for(let tileType of tileTypes) {
            this.tileTypes.set(tileType.type, tileType);
        }
        return this;
    }

    getTileTypes(): TileType[] {
        return Array.from(this.tileTypes.values());
    }

    getNeighbours(p: Position): Position[] {
        const neighbours: Position[] = [];
        if(p.x > 0) {
            neighbours.push(new Position(p.x-1, p.y));
        }
        if(p.x < this.width-1) {
            neighbours.push(new Position(p.x+1, p.y));
        }
        if(p.y > 0) {
            neighbours.push(new Position(p.x, p.y-1));
        }
        if(p.y < this.length-1) {
            neighbours.push(new Position(p.x, p.y+1));
        }
        return neighbours;
    }

    getCost(p: Position): number {
        return this.tileTypes.get(this.tiles[p.x][p.y][this.tiles[p.x][p.y].length-1])!.cost;
    }

    isValidPosition(p: Position): boolean {
        return p.x >= 0 && p.x < this.tiles.length
            && p.y >= 0 && p.y < this.tiles[p.x].length;
    }

    isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean {
        return this.getCost(p2) <= moves && this.getHeightDifference(p1, p2) <= jumps;
    }

    getHeightDifference(p1: Position, p2: Position): number {
        return Math.abs(this.tiles[p1.x][p1.y].length - this.tiles[p2.x][p2.y].length);
    }
}