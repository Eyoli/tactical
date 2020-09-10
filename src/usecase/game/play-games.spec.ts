import "reflect-metadata";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import Game from "../../tactical/domain/model/game";
import Field from "../../tactical/domain/model/field";
import Player from "../../tactical/domain/model/player";
import Unit from "../../tactical/domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import { FakeFieldAlgorithmService } from "../fake/fake-field-algorithm-service";
import Position from "../../tactical/domain/model/position";
import { UnitsComposition, UnitsPlacement } from "../../tactical/domain/model/types";
import { GameError, GameErrorCode } from "../../tactical/domain/model/error/game-error";
import FakeField from "../fake/fake-field";
import FakeActionService from "../fake/fake-action-service";
import { ActionType, TargetType, Range } from "../../tactical/domain/model/action/action-type";
import Statistics from "../../tactical/domain/model/statistics";
import { GameServicePort } from "../../tactical/domain/port/primary/services";
import { Damage } from "../../tactical/domain/model/weapon";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import {DamageType} from "../../tactical/domain/model/enums";
import GameService from "../../tactical/domain/service/game-service";
import PlayerService from "../../tactical/domain/service/player-service";
import UnitService from "../../tactical/domain/service/unit-service";

describe('About playing we should be able to...', () => {

    // Logger.setLogger(new ConsoleLoggerService());

    let gameService: GameServicePort;
    let playerRepository: RepositoryPort<Player>;
    let gameRepository: RepositoryPort<Game>;
    let unitRepository: RepositoryPort<Unit>;
    let fieldRepository: RepositoryPort<Field>;
    let actionService: FakeActionService;
    let fieldAlgorithmService: FakeFieldAlgorithmService;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>(new CounterIdGenerator("player"));
        gameRepository = new InMemoryRepository<Game>(new CounterIdGenerator("game"));
        unitRepository = new InMemoryRepository<Unit>(new CounterIdGenerator("unit"));
        fieldRepository = new InMemoryRepository<Field>(new CounterIdGenerator("field"));
        actionService = new FakeActionService();
        fieldAlgorithmService = new FakeFieldAlgorithmService();

        gameService = new GameService(
            gameRepository,
            new PlayerService(playerRepository),
            new UnitService(unitRepository),
            fieldRepository,
            fieldAlgorithmService,
            actionService
        );
    });

    describe('start a game...', () => {
        it('valid case', () => {
            // arrange / act
            const game = aGameWithTwoPlayers();
            const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
            gameService.startGame(game.id, unitsComposition);

            // assert
            const unitsPlayer1 = game.getUnits(game.players[0]);
            const unitsPlayer2 = game.getUnits(game.players[1]);
            Assert.deepStrictEqual(unitsPlayer1.length, 1);
            Assert.deepStrictEqual(unitsPlayer2.length, 1);
            Assert.notStrictEqual(unitsPlayer1[0].id, unitsPlayer2[0].id);
        });

        it('invalid position', () => {
            // arrange / act
            const game = aGameWithTwoPlayers(false);
            const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
            const startGame = () => gameService.startGame(game.id, unitsComposition);

            // assert
            Assert.throws(startGame, new GameError(GameErrorCode.INVALID_POSITION));
        });
    });

    it('alternate turn between players', () => {
        // arrange
        let game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);
        const player1 = game.players[0];
        const unit1 = game.getUnits(player1)[0];
        const player2 = game.players[1];
        const unit2 = game.getUnits(player2)[0];

        // act
        const unitPerTurn = [];
        unitPerTurn.push(game.getCurrentUnit());
        game = gameService.finishTurn(game.id);
        unitPerTurn.push(game.getCurrentUnit());
        game = gameService.finishTurn(game.id);
        unitPerTurn.push(game.getCurrentUnit());

        // assert
        Assert.deepStrictEqual(unitPerTurn[0]?.id, unit1.id);
        Assert.deepStrictEqual(unitPerTurn[1]?.id, unit2.id);
        Assert.deepStrictEqual(unitPerTurn[2]?.id, unit1.id);
    });

    describe('move a unit...', () => {

        it('valid unit', () => {
            // arrange
            const game = aGameWithTwoPlayers();
            const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
            gameService.startGame(game.id, unitsComposition);

            const player1 = game.players[0];
            const unit1 = game.getUnits(player1)[0];

            // act
            const newUnitState = gameService.moveUnit(game.id, unit1.id, new Position(1, 1, 0));
            const moveASecondTime = () => gameService.moveUnit(game.id, unit1.id, new Position(1, 2, 0));

            // assert
            Assert.deepStrictEqual(newUnitState.position.equals(new Position(1, 1, 0)), true);
            Assert.throws(moveASecondTime, new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT));
        });

        it('invalid unit', () => {
            // arrange
            const game = aGameWithTwoPlayers();
            const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
            gameService.startGame(game.id, unitsComposition);

            const player2 = game.players[1];
            const unit2 = game.getUnits(player2)[0];

            // act
            const moveAFirstTime = () => gameService.moveUnit(game.id, unit2.id, new Position(1, 2, 0));

            // assert
            Assert.throws(moveAFirstTime, new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT));
        });
    });

    it('act on a position', () => {
        // arrange
        const game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);

        const unit1 = game.getUnits(game.players[0])[0];
        const unit2 = game.getUnits(game.players[1])[0];
        const unitState2 = game.getUnitState(unit2.id);

        actionService
            .withActionType(new ActionType("attack", TargetType.UNIT));

        // act
        gameService.actOnPosition(game.id, unit1.id, unitState2.position, "attack");
        const actASecondTime = () => gameService.actOnPosition(game.id, unit1.id, unitState2.position, "attack");

        // assert
        const unitState = game.getUnitState(unit2.id);
        Assert.deepStrictEqual(unitState?.health.current, 190);
        Assert.throws(actASecondTime, new GameError(GameErrorCode.IMPOSSIBLE_TO_ACT));
    });

    it('act on a position with area', () => {
        // arrange
        const game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);

        const unit1 = game.getUnits(game.players[0])[0];
        const unit2 = game.getUnits(game.players[1])[0];
        const unitState2 = game.getUnitState(unit2.id);

        actionService
            .withActionType(new ActionType("fireball", TargetType.AREA,
                new Range(1, 1, 1), new Damage(10, DamageType.CUTTING), new Range(0, 2, 1)));
        fieldAlgorithmService.withPositionsInRange([new Position(0,0,0)]);

        // act
        gameService.actOnPosition(game.id, unit1.id, unitState2.position, "fireball");

        // assert
        const unitState = game.getUnitState(unit2.id);
        Assert.deepStrictEqual(unitState?.health.current, 190);
    });

    it('rollback an action performed during a turn', () => {
        // arrange
        const game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);

        const unit1 = game.getUnits(game.players[0])[0];
        const unit2 = game.getUnits(game.players[1])[0];
        const unitState2 = game.getUnitState(unit2.id);

        actionService
            .withActionType(new ActionType("attack", TargetType.UNIT));

        // act
        gameService.actOnPosition(game.id, unit1.id, unitState2.position, "attack");
        gameService.rollbackLastAction(game.id);
        gameService.rollbackLastAction(game.id);

        // assert
        const unitState = game.getUnitState(unit2.id);
        Assert.deepStrictEqual(unitState?.health.current, 200);
    });

    it('rollback a move performed during a turn', () => {
        // arrange
        const game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);

        const unit1 = game.getUnits(game.players[0])[0];

        // act
        gameService.moveUnit(game.id, unit1.id, new Position(1, 2, 0));
        gameService.rollbackLastAction(game.id);

        // assert
        const unitState = game.getUnitState(unit1.id);
        Assert.deepStrictEqual(unitState?.position, new Position(1, 0, 0));
    });

    it('prevent rollback a move performed during last turn', () => {
        // arrange
        const game = aGameWithTwoPlayers();
        const unitsComposition = aUnitComposition(game.players[0], game.players[1]);
        gameService.startGame(game.id, unitsComposition);

        const unit1 = game.getUnits(game.players[0])[0];

        // act
        gameService.moveUnit(game.id, unit1.id, new Position(1, 2, 0));
        gameService.finishTurn(game.id);
        gameService.rollbackLastAction(game.id);

        // assert
        const unitState = game.getUnitState(unit1.id);
        Assert.deepStrictEqual(unitState?.position, new Position(1, 2, 0));
    });

    function aGameWithTwoPlayers(validPositions: boolean = true) {
        const player1 = new Player("Player 1");
        const player2 = new Player("Player 2");
        player1.id = playerRepository.save(player1);
        player2.id = playerRepository.save(player2);

        let game = new Game();
        game.addPlayers(player1, player2);
        game.id = gameRepository.save(game);

        const field = new FakeField("Field", validPositions);
        field.id = fieldRepository.save(field);
        game.field = field;

        return game;
    }

    function aUnitComposition(player1: Player, player2: Player) {
        const unit1 = new Unit().withStatistics(new Statistics().withHealth(100));
        const unit2 = new Unit().withStatistics(new Statistics().withHealth(200));
        unit1.id = unitRepository.save(unit1);
        unit2.id = unitRepository.save(unit2);
        const unitsComposition: UnitsComposition = new Map();
        const player1UnitsPlacement: UnitsPlacement = new Map();
        player1UnitsPlacement.set(unit1.id, new Position(1, 0, 0));
        const player2UnitsPlacement: UnitsPlacement = new Map();
        player2UnitsPlacement.set(unit2.id, new Position(0, 0, 0));
        unitsComposition.set(player1.id, player1UnitsPlacement);
        unitsComposition.set(player2.id, player2UnitsPlacement);

        return unitsComposition;
    }
});