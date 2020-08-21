import "reflect-metadata";
import Unit from "../../tactical/domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import { MovementServicePort } from "../../tactical/domain/port/primary/services";
import Tile from "../../tactical/domain/model/tile-based-field/tile";
import Position from "../../tactical/domain/model/position";
import MovementService from "../../tactical/adapter/service/movement-service";
import UnitState from "../../tactical/domain/model/unit-state";
import TileBasedField from "../../tactical/domain/model/tile-based-field/tile-based-field";
import Statistics from "../../tactical/domain/model/statistics";
import TileType from "../../tactical/domain/model/tile-based-field/tile-type";

describe('About moving a unit in a field...', () => {

    const movementService: MovementServicePort = new MovementService();

    beforeEach(() => {
    });

    it('flat and homogeneous field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTileTypes(new TileType(1, 1, ""))
            .withTiles(
                [[1], [1], [1]],
                [[1], [1], [1]],
                [[1], [1], [1]]);
        const unit = new Unit().withStatistics(new Statistics()
            .withMoves(2).withJumps(1));
        const unitState = UnitState.init(unit, new Position(0, 0, 0));

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 6);
    });

    it('heterogeneous field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTileTypes(new TileType(1, 1, ""), new TileType(2, 2, ""))
            .withTiles(
                [[1], [1], [1]],
                [[1], [2], [1]],
                [[1], [1], [1]]);
        const unit = new Unit().withStatistics(new Statistics()
            .withMoves(2).withJumps(1));
        const unitState = UnitState.init(unit, new Position(0, 0, 0));

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('unlevel field', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTileTypes(new TileType(1, 1, ""))
            .withTiles(
                [[1], [1], [1]],
                [[1], [1, 1], [1]],
                [[1], [1], [1]]);
        const unit = new Unit().withStatistics(new Statistics()
            .withMoves(2).withJumps(0));
        const unitState = UnitState.init(unit, new Position(0, 0, 0));

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });

    it('check position accessibility', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTileTypes(new TileType(1, 1, ""))
            .withTiles(
                [[1], [1], [1]],
                [[1], [1, 1], [1]],
                [[1], [1], [1]]);
        const unit = new Unit().withStatistics(new Statistics()
            .withMoves(2).withJumps(0));
        const unitState = UnitState.init(unit, new Position(0, 0, 0));

        // act
        const unreachablePosition = movementService.isAccessible(field, unitState, new Position(1, 1, 1));
        const invalidHeight = movementService.isAccessible(field, unitState, new Position(1, 0, 1));
        const samePosition = movementService.isAccessible(field, unitState, new Position(0, 0, 0));
        const accessiblePosition = movementService.isAccessible(field, unitState, new Position(1, 0, 0));

        // assert
        Assert.deepStrictEqual(unreachablePosition, false);
        Assert.deepStrictEqual(invalidHeight, false);
        Assert.deepStrictEqual(samePosition, false);
        Assert.deepStrictEqual(accessiblePosition, true);
    });
});