export enum RangeType {
    FIXED = "FIXED",
    WEAPON = "WEAPON"
}

export enum TargetType {
    UNIT = "UNIT",
    AREA = "AREA"
}

export class Range {
    readonly min: number;
    readonly max: number;
    readonly height: number;
    readonly area: number;

    constructor(min: number, max: number, height: number, area: number) {
        this.min = min;
        this.max = max;
        this.height = height;
        this.area = area;
    }
}

export class ActionType {
    readonly id: string;
    readonly rangeType: RangeType;
    readonly range?: Range;
    readonly targetType: TargetType;

    constructor(id: string, targetType: TargetType, rangeType: RangeType, range?: Range) {
        this.id = id;
        this.rangeType = rangeType;
        this.targetType = targetType;
        this.range = range;
    }
}