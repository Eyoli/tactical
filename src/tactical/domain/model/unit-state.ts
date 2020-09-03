import Unit from "./unit";
import Position from "./position";
import { Damage } from "./weapon";

/**
 * Represent a given state of a unit 
 */
class HistorizedValue {
    current: number;
    last: number;

    constructor(value: number) {
        this.current = value;
        this.last = value;
    }

    update(value: number) {
        this.last = this.current;
        this.current = value;
    }
}

export default class UnitState {
    private unit!: Unit;
    private position!: Position;
    private health!: HistorizedValue;
    private spirit!: number;
    private moved!: boolean;
    private acted!: boolean;

    private constructor() {}

    getUnit(): Unit {
        return this.unit;
    }

    getJumps(): number {
        return this.unit.getStatistics().jumps;
    }

    getMoves(): number {
        return this.unit.getStatistics().moves;
    }

    getPosition(): Position {
        return this.position;
    }

    getHealth(): HistorizedValue {
        return this.health;
    }

    hasMoved(): boolean {
        return this.moved;
    }

    hasActed(): boolean {
        return this.acted;
    }

    computeWeaponDamage(): Damage {
        return this.getUnit().getWeapon().damage;
    }

    copy(): UnitState {
        const unitState = new UnitState();
        unitState.unit = this.unit;
        unitState.moved = this.moved;
        unitState.acted = this.acted;
        unitState.position = this.position;
        unitState.health = new HistorizedValue(this.health.current);
        unitState.spirit = this.spirit;
        return unitState;
    }

    toNextTurn(): UnitState {
        const unitState = this.copy();
        unitState.moved = false;
        unitState.acted = false;
        return unitState;
    }

    movingTo(p: Position): UnitState {
        const unitState = this.copy();
        unitState.position = p;
        unitState.moved = true;
        return unitState;
    }

    damaged(damage: Damage): UnitState {
        const unitState = this.copy();
        unitState.health.update(unitState.health.current - damage.amount);
        return unitState;
    }

    acting(): UnitState {
        const unitState = this.copy();
        unitState.acted = true;
        return unitState;
    }

    static init(unit: Unit, p: Position): UnitState {
        const unitState = new UnitState();
        unitState.unit = unit;
        unitState.position = p;
        unitState.health = new HistorizedValue(unit.getStatistics().health);
        unitState.spirit = unit.getStatistics().spirit;
        unitState.moved = false;
        unitState.acted = false;
        return unitState;
    }
}