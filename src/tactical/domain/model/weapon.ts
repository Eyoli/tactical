import { Range } from "./action/action-type";
import {Ailment, DamageType, Element} from "./enums";

export class Damage {
    readonly amount: number;
    readonly type: DamageType;
    readonly element?: Element;
    readonly ailment?: Ailment;

    constructor(amount: number, type: DamageType, element?: Element, ailment?: Ailment) {
        this.amount = amount;
        this.type = type;
        this.element = element;
        this.ailment = ailment;
    }
}

export class Weapon {
    readonly range: Range;
    readonly damage: Damage;

    constructor(range: Range, damage: Damage) {
        this.range = range;
        this.damage = damage;
    }
}