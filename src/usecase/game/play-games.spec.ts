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
import { IGameService } from "../../domain/port/primary/services";
import PlayerService from "../../domain/service/player-service";
import UnitService from "../../domain/service/unit-service";
import { FakeMovementService } from "../fake/services";
import Position from "../../domain/model/position";
import { UnitsComposition, UnitsPlacement } from "../../domain/model/aliases";
import { GameError, GameErrorCode } from "../../domain/error/game-error";

describe('About playing we should be able to...', () => {

    let gameService: IGameService;
    let playerRepository: Repository<Player>;
    let gameRepository: Repository<Game>;
    let unitRepository: Repository<Unit>;
    let fieldRepository: Repository<Field>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>();
        gameRepository = new InMemoryRepository<Game>();
        unitRepository = new InMemoryRepository<Unit>();
        fieldRepository = new InMemoryRepository<Field>();

        gameService = new GameService(gameRepository, new PlayerService(playerRepository),
            new UnitService(unitRepository), fieldRepository, new FakeMovementService());
    });

    it('start a game', () => {
        // arrange / act
        const game = aStartedGame();

        // assert
        Assert.deepStrictEqual(game.getUnits(game.players[0]).length, 1);
        Assert.deepStrictEqual(game.getUnits(game.players[1]).length, 1);
    });

    it('alternate turn between players', () => {
        // arrange
        let game = aStartedGame();

        // act
        const playerPerTurn = [];
        playerPerTurn.push(game.getCurrentPlayer());
        game = gameService.finishTurn(game.id);
        playerPerTurn.push(game.getCurrentPlayer());
        game = gameService.finishTurn(game.id);
        playerPerTurn.push(game.getCurrentPlayer());

        // assert
        Assert.deepStrictEqual(playerPerTurn[0]?.name, "Player 1");
        Assert.deepStrictEqual(playerPerTurn[1]?.name, "Player 2");
        Assert.deepStrictEqual(playerPerTurn[2]?.name, "Player 1");
    });

    describe('move a unit...', () => {

        it('valid unit', () => {
            // arrange
            const game = aStartedGame();
            const player1 = game.players[0];
            const unit1 = game.getUnits(player1)[0];

            // act
            const newUnitState = gameService.moveUnit(game.id, unit1.id, new Position(1, 1));
            const moveASecondTime = () => gameService.moveUnit(game.id, unit1.id, new Position(1, 2));

            // assert
            Assert.deepStrictEqual(newUnitState.position.equals(new Position(1, 1)), true);
            Assert.throws(moveASecondTime, new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT));
        });

        it('invalid unit', () => {
            const game = aStartedGame();
            const player2 = game.players[1];
            const unit2 = game.getUnits(player2)[0];

            // act
            const moveAFirstTime = () => gameService.moveUnit(game.id, unit2.id, new Position(1, 2));

            // assert
            Assert.throws(moveAFirstTime, new GameError(GameErrorCode.IMPOSSIBLE_TO_MOVE_UNIT));
        });
    });

    function aStartedGame() {
        const player1 = new Player("Player 1");
        const player2 = new Player("Player 2");
        player1.id = playerRepository.save(player1);
        player2.id = playerRepository.save(player2);

        const unit1 = new Unit("Unit 1");
        const unit2 = new Unit("Unit 2");
        unit1.id = unitRepository.save(unit1);
        unit2.id = unitRepository.save(unit2);
        const unitsComposition: UnitsComposition = new Map();
        const player1UnitsPlacement: UnitsPlacement = new Map();
        player1UnitsPlacement.set(unit1.id, new Position(0, 0));
        const player2UnitsPlacement: UnitsPlacement = new Map();
        player2UnitsPlacement.set(unit2.id, new Position(0, 0));
        unitsComposition.set(player1.id, player1UnitsPlacement);
        unitsComposition.set(player2.id, player2UnitsPlacement);

        let game = new Game();
        game.addPlayers(player1, player2);
        game.id = gameRepository.save(game);

        // act
        game = gameService.startGame(game.id, unitsComposition);

        return game;
    }
});