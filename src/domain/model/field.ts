import { CreateFieldRequest } from "../../api/request/requests";
import Tile from "./tile";
import Position from "./position";

export default class Field {
    id!: string;
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

    private getWidth(): number {
        return this.tiles.length;
    }

    private getLength(x: number): number {
        return this.tiles[x].length;
    }

    getNeighbours(p: Position) {
        const neighbours: Position[] = [];
        if(p.x > 0) {
            neighbours.push(new Position(p.x-1, p.y));
        }
        if(p.x < this.getWidth()-1) {
            neighbours.push(new Position(p.x+1, p.y));
        }
        if(p.y > 0) {
            neighbours.push(new Position(p.x, p.y-1));
        }
        if(p.y < this.getLength(p.x)-1) {
            neighbours.push(new Position(p.x, p.y+1));
        }
        return neighbours;
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
}