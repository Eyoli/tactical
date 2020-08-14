export default class Tile {
    readonly cost: number;
    readonly type: number;

    constructor(type: number, cost: number = 1) {
        this.type = type;
        this.cost = cost;
    }
}