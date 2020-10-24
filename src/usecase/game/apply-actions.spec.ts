import * as Assert from "assert";
import ActionService from "../../tactical/domain/service/action-service";
import { ActionServicePort } from "../../tactical/domain/port/primary/services";
import Unit from "../../tactical/domain/model/unit";
import { Weapon, Damage } from "../../tactical/domain/model/weapon";
import UnitState from "../../tactical/domain/model/unit-state";
import Position from "../../tactical/domain/model/position";
import Statistics from "../../tactical/domain/model/statistics";
import { Range } from "../../tactical/domain/model/action/action-type";
import InMemoryActionTypeRepository from "../../in-memory-repository/adapter/in-memory-action-type-repository";
import { DamageType, Direction } from "../../tactical/domain/model/enums";

describe('Actions should work correctly...', () => {

    let actionService: ActionServicePort;

    beforeEach(() => {
        actionService = new ActionService(new InMemoryActionTypeRepository());
    });

    describe('weapon attack', () => {
        const srcUnit = new Unit().withStatistics(new Statistics.Builder().build());
        const targetUnit = new Unit().withStatistics(new Statistics.Builder().withHealth(20).build());

        it('valid case', () => {
            // arrange
            srcUnit.withWeapon(new Weapon(new Range(1, 1, 1), new Damage(10, DamageType.CUTTING)))
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0), Direction.DOWN);
            const targetUnitState = UnitState.init(targetUnit, new Position(1, 0, 0), Direction.DOWN);
            const actionType = actionService.getActionType("attack");

            // act
            const attackAction = actionService.generateAction(actionType, srcUnitState, targetUnitState);
            const validation = attackAction.validate();
            const newStates = attackAction.apply();

            // assert
            Assert.deepStrictEqual(validation, true);
            Assert.deepStrictEqual(newStates.length, 2);
            Assert.deepStrictEqual(newStates[1].health.current, 10);
        });

        it('invalid range', () => {
            // arrange
            srcUnit.withWeapon(new Weapon(new Range(1, 1, 1), new Damage(10, DamageType.CUTTING)))
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0), Direction.DOWN);
            const targetUnitState = UnitState.init(targetUnit, new Position(2, 0, 0), Direction.DOWN);
            const actionType = actionService.getActionType("attack");

            // act
            const attackAction = actionService.generateAction(actionType, srcUnitState, targetUnitState);
            const validation = attackAction.validate();

            // assert
            Assert.deepStrictEqual(validation, false);
        });
    });

    describe('non weapon attack', () => {
        const srcUnit = new Unit().withStatistics(new Statistics.Builder().build());
        const targetUnit = new Unit().withStatistics(new Statistics.Builder().withHealth(20).build());

        it('valid case', () => {
            // arrange
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0), Direction.DOWN);
            const targetUnitState = UnitState.init(targetUnit, new Position(2, 0, 0), Direction.DOWN);
            const actionType = actionService.getActionType("fireball");

            // act
            const attackAction = actionService.generateAction(actionType, srcUnitState, targetUnitState);
            const validation = attackAction.validate();
            const newStates = attackAction.apply();

            // assert
            Assert.deepStrictEqual(validation, true);
            Assert.deepStrictEqual(newStates.length, 2);
            Assert.deepStrictEqual(newStates[1].health.current, 0);
        });

        it('invalid range', () => {
            // arrange
            const srcUnitState = UnitState.init(srcUnit, new Position(0, 0, 0), Direction.DOWN);
            const targetUnitState = UnitState.init(targetUnit, new Position(6, 0, 0), Direction.DOWN);
            const actionType = actionService.getActionType("fireball");

            // act
            const attackAction = actionService.generateAction(actionType, srcUnitState, targetUnitState);
            const validation = attackAction.validate();

            // assert
            Assert.deepStrictEqual(validation, false);
        });
    });
});