import Unit from "./unit";
import Position from "./position";
import { Damage } from "./weapon";
import { Direction } from './enums';

/**
 * Represent a given state of a unit 
 */
class HistorizedValue {
    readonly current: number;
    readonly last: number;

    constructor(current: number, last?: number) {
        this.current = current;
        this.last = last || current;
    }
}

export default class UnitState {
    readonly unit: Unit;
    readonly position: Position;
    readonly direction: Direction;
    readonly health: HistorizedValue;
    readonly spirit: number;
    readonly moved: boolean;
    readonly acted: boolean;
    readonly path?: Position[];

    private constructor(unit: Unit, position: Position, direction: Direction, health: HistorizedValue, spirit: number,
        moved = false, acted = false, path?: Position[]) {
        this.unit = unit;
        this.position = position;
        this.direction = direction;
        this.health = health;
        this.spirit = spirit;
        this.moved = moved;
        this.acted = acted;
        this.path = path;
    }

    getJumps(): number {
        return this.unit.statistics.jumps;
    }

    getMoves(): number {
        return this.unit.statistics.moves;
    }

    computeWeaponDamage(): Damage {
        return this.unit.weapon.damage;
    }

    toNextTurn(): UnitState {
        return new UnitState(
            this.unit,
            this.position,
            this.direction,
            new HistorizedValue(this.health.current),
            this.spirit);
    }

    movingTo(p: Position, path: Position[]): UnitState {
        return new UnitState(
            this.unit,
            p,
            this.computeDirection(this.position, p),
            new HistorizedValue(this.health.current),
            this.spirit,
            true,
            this.acted,
            path
        );
    }

    acting(): UnitState {
        return new UnitState(
            this.unit,
            this.position,
            this.direction,
            new HistorizedValue(this.health.current),
            this.spirit,
            this.moved,
            true
        );
    }

    damaged(damage: Damage): UnitState {
        return new UnitState(
            this.unit,
            this.position,
            this.direction,
            new HistorizedValue(this.health.current - damage.amount, this.health.current),
            this.spirit,
            this.moved,
            this.acted
        );
    }

    private computeDirection(start: Position, end: Position): Direction {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx >= 0) {
                return Direction.DOWN;
            }
            return Direction.UP;
        }
        if (dy >= 0) {
            return Direction.RIGHT;
        }
        return Direction.LEFT;
    }

    static init(unit: Unit, p: Position, direction: Direction): UnitState {
        return new UnitState(
            unit,
            p,
            direction,
            new HistorizedValue(unit.statistics.health),
            unit.statistics.spirit
        );
    }
}