export enum RangeType {
    FIXED = "FIXED",
    WEAPON = "WEAPON"
}

export enum TargetType {
    UNIT = "UNIT",
    AREA = "AREA"
}

export class ActionType {
    readonly id: string;
    readonly rangeType: RangeType;
    readonly rangeMin?: number;
    readonly rangeMax?: number;
    readonly targetType: TargetType;
    readonly area?: number;

    constructor(id: string, targetType: TargetType, rangeType: RangeType,
        rangeMin?: number, rangeMax?: number, area?: number) {
        this.id = id;
        this.rangeType = rangeType;
        this.targetType = targetType;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.area = area;
    }

}