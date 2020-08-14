import "reflect-metadata";
import Unit from "../../domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import { MovementServicePort } from "../../domain/port/primary/services";
import Tile from "../../domain/model/tile-based-field/tile";
import Position from "../../domain/model/position";
import MovementService from "../../domain/service/movement-service";
import UnitState from "../../domain/model/unit-state";
import TileBasedField from "../../domain/model/tile-based-field/tile-based-field";

describe('About moving a unit in a field...', () => {

    const movementService: MovementServicePort = new MovementService();

    beforeEach(() => {
    });

    it('flat and homogeneous field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(1);
        const unitState = new UnitState.Builder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 6);
    });

    it('heterogeneous field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 2)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(1);
        const unitState = new UnitState.Builder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('unlevel field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1), new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(0);
        const unitState = new UnitState.Builder().init(unit, new Position(0, 0)).build();

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('check position accessibility', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTiles(
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1), new Tile(1, 1)], [new Tile(1, 1)]],
                [[new Tile(1, 1)], [new Tile(1, 1)], [new Tile(1, 1)]]);
        const unit = new Unit("Unit").withMoves(2).withJumps(0);
        const unitState = new UnitState.Builder().init(unit, new Position(0, 0)).build();

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