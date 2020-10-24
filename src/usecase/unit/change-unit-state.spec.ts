import UnitState from "../../tactical/domain/model/unit-state";
import Unit from "../../tactical/domain/model/unit";
import Statistics from "../../tactical/domain/model/statistics";
import Position from "../../tactical/domain/model/position";
import { Direction } from "../../tactical/domain/model/enums";
import * as Assert from "assert";

describe('Changing unit state...', () => {

    it('Move', () => {
        // arrange
        const state = UnitState.init(
            new Unit().withStatistics(new Statistics.Builder().withHealth(100).build()),
            new Position(1, 1, 0),
            Direction.DOWN);

        // act
        const newStateDown = state.movingTo(new Position(2, 1, 0), []);
        const newStateUp = state.movingTo(new Position(0, 1, 0), []);
        const newStateRight = state.movingTo(new Position(1, 2, 0), []);
        const newStateLeft = state.movingTo(new Position(1, 0, 0), []);

        // assert
        Assert.deepStrictEqual(newStateDown.direction, Direction.DOWN);
        Assert.deepStrictEqual(newStateUp.direction, Direction.UP);
        Assert.deepStrictEqual(newStateRight.direction, Direction.RIGHT);
        Assert.deepStrictEqual(newStateLeft.direction, Direction.LEFT);
        Assert.deepStrictEqual(newStateDown.moved, true);
    });
})