import "reflect-metadata";
import Field from "../../domain/model/field";
import Unit from "../../domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import { IMovementService } from "../../domain/port/primary/services";
import Tile from "../../domain/model/tile";
import Position from "../../domain/model/position";
import MovementService from "../../domain/service/movement-service";
import { UnitStateBuilder } from "../../domain/model/unit-state";

describe('Get positions accessible to a unit', () => {

    const movementService: IMovementService = new MovementService();

    beforeEach(() => {
    });

    it('flat and homogeneous field', () => {
        // arrange
        const field = new Field("Field")
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(1);
        const unitState = new UnitStateBuilder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 6);
    });

    it('heterogeneous field', () => {
        // arrange
        const field = new Field("Field")
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 2)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(1);
        const unitState = new UnitStateBuilder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('unlevel field', () => {
        // arrange
        const field = new Field("Field")
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1), new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(0);
        const unitState = new UnitStateBuilder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('check position accessibility', () => {
        // arrange
        const field = new Field("Field")
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1), new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(0);
        const unitState = new UnitStateBuilder().init(unit, new Position(0, 0)).build();

        // act
        const inaccessiblePosition = movementService.isAccessible(field, unitState, new Position(1, 1));
        const samePosition = movementService.isAccessible(field, unitState, new Position(0, 0));
        const accessiblePosition = movementService.isAccessible(field, unitState, new Position(1, 0));

        // assert
        Assert.deepStrictEqual(inaccessiblePosition, false);
        Assert.deepStrictEqual(samePosition, false);
        Assert.deepStrictEqual(accessiblePosition, true);
    });
});