export default class Tile {
    cost: number;
    type: number;

    constructor(type: number, cost: number = 1) {
        this.type = type;
        this.cost = cost;
    }
}