import "reflect-metadata";
import Unit from "../../tactical/domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import { FieldAlgorithmServicePort as FieldAlgorithmServicePort } from "../../tactical/domain/port/primary/services";
import Position from "../../tactical/domain/model/position";
import FieldAlgorithmService from "../../tactical/adapter/primary/field-algorithm-service";
import UnitState from "../../tactical/domain/model/unit-state";
import TileBasedField from "../../tactical/domain/model/tile-based-field/tile-based-field";
import Statistics from "../../tactical/domain/model/statistics";
import TileType from "../../tactical/domain/model/tile-based-field/tile-type";
import { Range } from "../../tactical/domain/model/action/action-type";

describe('About field algorithms...', () => {

    const fieldAlgorithmService: FieldAlgorithmServicePort = new FieldAlgorithmService();

    beforeEach(() => {
    });

    it('Getting positions in range...', () => {
        // arrange
        const field = new TileBasedField("Field", 3, 3, 3)
            .withId("fieldId")
            .withTileTypes(new TileType(1, 10, ""))
            .withTiles(
                [[1], [1], [1]],
                [[1], [1, 1], [1]],
                [[1], [1], [1]]);
        const range = new Range(2, 4, 0);
        const position = new Position(0, 0, 0);

        // act
        const positionsInRange = fieldAlgorithmService.getPositionsInRange(field, position, range);

        // assert
        Assert.deepStrictEqual(positionsInRange.length, 5);
    });

    describe('Getting accessible positions...', () => {

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
            const accessiblePositions = fieldAlgorithmService.getAccessiblePositions(field, unitState);

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
            const accessiblePositions = fieldAlgorithmService.getAccessiblePositions(field, unitState);

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
            const accessiblePositions = fieldAlgorithmService.getAccessiblePositions(field, unitState);

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
            const unreachablePosition = fieldAlgorithmService.isAccessible(field, unitState, new Position(1, 1, 1));
            const invalidHeight = fieldAlgorithmService.isAccessible(field, unitState, new Position(1, 0, 1));
            const samePosition = fieldAlgorithmService.isAccessible(field, unitState, new Position(0, 0, 0));
            const accessiblePosition = fieldAlgorithmService.isAccessible(field, unitState, new Position(1, 0, 0));

            // assert
            Assert.deepStrictEqual(unreachablePosition, false);
            Assert.deepStrictEqual(invalidHeight, false);
            Assert.deepStrictEqual(samePosition, false);
            Assert.deepStrictEqual(accessiblePosition, true);
        });
    });

});