export default class TileType {
    readonly type: number;
    readonly src: string;

    constructor(type: number, src: string) {
        this.type = type;
        this.src = src;
    }
}