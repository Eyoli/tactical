import * as Assert from "assert";
import ActionService from "../../tactical/adapter/service/action-service";
import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import Unit from "../../tactical/domain/model/unit";
import { Weapon, Damage, DamageType } from "../../tactical/domain/model/weapon";
import UnitState from "../../tactical/domain/model/unit-state";
import Position from "../../tactical/domain/model/position";
import Statistics from "../../tactical/domain/model/statistics";
import ActionType from "../../tactical/domain/model/action/action-type";

describe('About action we should be able to...', () => {

    let actionService: ActionServicePort;

    beforeEach(() => {
        actionService = new ActionService();
    });

    describe('attack another player', () => {
        const srcUnit = new Unit().withStatistics(new Statistics());
        const targetUnit = new Unit().withStatistics(new Statistics().withHealth(20));

        it('valid case', () => {
            // arrange
            srcUnit.withWeapon(new Weapon(1, 1, new Damage(10, DamageType.CUTTING)))
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0));
            const targetUnitState = UnitState.init(targetUnit, new Position(1, 0, 0));

            // act
            const attackAction = actionService.generateActionOnTarget(srcUnitState, targetUnitState, ActionType.ATTACK);
            const validation = attackAction.validate();
            const newStates = attackAction.apply();

            // assert
            Assert.deepStrictEqual(validation, true);
            Assert.deepStrictEqual(newStates.length, 1);
            Assert.deepStrictEqual(newStates[0].getHealth(), 10);
        });

        it('invalid range', () => {
            // arrange
            srcUnit.withWeapon(new Weapon(1, 1, new Damage(10, DamageType.CUTTING)))
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0));
            const targetUnitState = UnitState.init(targetUnit, new Position(2, 0, 0));

            // act
            const attackAction = actionService.generateActionOnTarget(srcUnitState, targetUnitState, ActionType.ATTACK);
            const validation = attackAction.validate();

            // assert
            Assert.deepStrictEqual(validation, false);
        });
    });
});