import Unit from "../../tactical/domain/model/unit";
import Statistics from "../../tactical/domain/model/statistics";
import { Weapon, Damage } from "../../tactical/domain/model/weapon";
import { Range } from "../../tactical/domain/model/action/action-type";
import {DamageType} from "../../tactical/domain/model/enums";

export default class CreateUnitRequest {
    name!: string;
    moves!: number;
    jumps!: number;

    constructor(input: any) {
        this.name = input.name;
        this.moves = input.moves;
        this.jumps = input.jumps;
    }

    validate(): string[] {
        const warnings = [];
        if (!this.name) {
            warnings.push("name is required")
        }
        if (!this.moves) {
            warnings.push("moves is required")
        }
        if (!this.jumps) {
            warnings.push("jumps is required")
        }
        return warnings;
    }

    toUnit(): Unit {
        const unit = new Unit()
            .withName(this.name)
            .withStatistics(new Statistics()
                .withHealth(100)
                .withJumps(this.jumps)
                .withMoves(this.moves))
            .withWeapon(
                new Weapon(new Range(1, 4, 1),
                    new Damage(10, DamageType.CUTTING)));
        return unit;
    }
}