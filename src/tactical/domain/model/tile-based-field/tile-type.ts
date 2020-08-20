export default class TileType {
    readonly type: number;
    readonly src: string;
    readonly cost: number;

    constructor(type: number, cost: number, src: string) {
        this.type = type;
        this.cost = cost;
        this.src = src;
    }
}