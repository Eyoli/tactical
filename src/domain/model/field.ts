import { CreateFieldRequest } from "../port/primary/requests";
import Tile from "./tile";
import Position from "./position";

export default class Field {
    id?: string;
    name: string;
    tiles: Tile[][][];

    constructor(name: string) {
        this.name = name;
        this.tiles = [[]];
    }

    withId(id: string) {
        this.id = id;
        return this;
    }

    withTiles(...lines: Tile[][][]) {
        this.tiles.push(...lines);
        return this;
    }

    getAccessibleTiles(p: Position, moves: number, jumps: number): [Tile, Position, number][] {
        const positionsToCheck: Position[] = [];
        if(p.x > 0) {
            positionsToCheck.push(new Position(p.x-1, p.y));
        }
        if(p.x < this.tiles.length-1) {
            positionsToCheck.push(new Position(p.x+1, p.y));
        }
        if(p.y > 0) {
            positionsToCheck.push(new Position(p.x, p.y-1));
        }
        if(p.y < this.tiles[p.x].length-1) {
            positionsToCheck.push(new Position(p.x, p.y+1));
        }
        return positionsToCheck
            .filter(p2 => this.isTileAccessible(p, p2, moves, jumps))
            .map(p2 => {
                const tile = this.getTopTile(p2);
                return [tile, p2, moves - tile.cost];
            });
    }

    private isTileAccessible(p1: Position, p2: Position, moves: number, jumps: number): boolean {
        return this.getTopTile(p2).cost <= moves && this.getHeightDifference(p1, p2) <= jumps;
    }

    getTopTile(p: Position): Tile {
        return this.tiles[p.x][p.y][this.tiles[p.x][p.y].length-1];
    }

    private getHeightDifference(p1: Position, p2: Position): number {
        return Math.abs(this.tiles[p1.x][p1.y].length - this.tiles[p2.x][p2.y].length);
    }

    static fromCreateRequest(createFieldRequest: CreateFieldRequest) {
        const field = new Field(createFieldRequest.name);
        return field;
    }
}