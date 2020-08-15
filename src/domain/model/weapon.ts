export default class Weapon {
    private range: number;

    constructor(range: number) {
        this.range = range;
    }

    getRange(): number {
        return this.range;
    }
}