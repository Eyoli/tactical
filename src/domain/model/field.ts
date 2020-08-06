import { CreateFieldRequest } from "../port/primary/requests";
import Tile from "./tile";
import Position from "./position";

export default class Field {
    id?: string;
    name: string;
    private tiles: Tile[][][];

    constructor(name: string) {
        this.name = name;
        this.tiles = [];
    }

    withId(id: string) {
        this.id = id;
        return this;
    }

    withTiles(...lines: Tile[][][]) {
        this.tiles.push(...lines);
        return this;
    }

    getTiles(): Tile[][][] {
        return this.tiles;
    }

    getTopTile(p: Position): Tile {
        return this.tiles[p.x][p.y][this.tiles[p.x][p.y].length-1];
    }

    isNeighbourAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean {
        return this.getTopTile(p2).cost <= moves && this.getHeightDifference(p1, p2) <= jumps;
    }

    getHeightDifference(p1: Position, p2: Position): number {
        return Math.abs(this.tiles[p1.x][p1.y].length - this.tiles[p2.x][p2.y].length);
    }

    static fromCreateRequest(createFieldRequest: CreateFieldRequest) {
        const field = new Field(createFieldRequest.name);
        return field;
    }
}