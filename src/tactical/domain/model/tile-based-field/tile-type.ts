export default class TileType {
    readonly type: number;
    readonly src: string;
    readonly cost: number;
    readonly liquid: boolean;

    constructor(type: number, cost: number, src: string, liquid: boolean = false) {
        this.type = type;
        this.cost = cost;
        this.src = src;
        this.liquid = liquid;
    }
}