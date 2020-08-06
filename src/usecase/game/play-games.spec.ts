import "reflect-metadata";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import GameService from "../../domain/service/game-service";
import Game from "../../domain/model/game";
import Field from "../../domain/model/field";
import Player from "../../domain/model/player";
import Unit from "../../domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import Repository from "../../domain/port/secondary/repository";
import { IGameService, IMovementService } from "../../domain/port/primary/services";
import PlayerService from "../../domain/service/player-service";
import UnitService from "../../domain/service/unit-service";
import Tile from "../../domain/model/tile";
import UnitState from "../../domain/model/unit-state";
import Position from "../../domain/model/position";
import MovementService from "../../domain/service/movement-service";

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
        const unitState = new UnitState(unit).withPosition(new Position(0, 0));

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
        const unitState = new UnitState(unit).withPosition(new Position(0, 0));

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
        const unitState = new UnitState(unit).withPosition(new Position(0, 0));

        // act
        const accessiblePositions = movementService.getAccessiblePositions(field, unitState);

        // assert
        Assert.deepStrictEqual(accessiblePositions.length, 5);
    });
});