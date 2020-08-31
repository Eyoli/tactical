import { Damage } from "../weapon";

export enum TargetType {
    UNIT = "UNIT",
    AREA = "AREA"
}

export class Range {
    readonly min: number;
    readonly max: number;
    readonly height: number;

    constructor(min: number, max: number, height: number) {
        this.min = min;
        this.max = max;
        this.height = height;
    }
}

export class ActionType {
    readonly id: string;
    readonly targetType: TargetType;
    readonly range?: Range;
    readonly damage?: Damage;
    readonly area?: Range;

    constructor(id: string, targetType: TargetType, range?: Range, damage?: Damage, area?: Range) {
        this.id = id;
        this.targetType = targetType;
        this.range = range;
        this.damage = damage;
        this.area = area;
    }
}