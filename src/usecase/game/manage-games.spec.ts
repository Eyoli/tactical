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
import ResourceNotFoundError from "../../domain/error/resource-not-found-error";
import PlayerService from "../../domain/service/player-service";
import UnitService from "../../domain/service/unit-service";

describe('About games we should be able to...', () => {

    let gameService: IGameService;
    let playerRepository: Repository<Player>;
    let gameRepository: Repository<Game>;
    let unitRepository: Repository<Unit>;
    let fieldRepository: Repository<Field>;
    let movementService: IMovementService;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>();
        gameRepository = new InMemoryRepository<Game>();
        unitRepository = new InMemoryRepository<Unit>();
        fieldRepository = new InMemoryRepository<Field>();
        
        gameService = new GameService(gameRepository, new PlayerService(playerRepository), 
            new UnitService(unitRepository), fieldRepository, movementService);
    });

    describe('create a new game', () => {
        it('valid case', () => {
            // arrange
            const gameIn = new Game();
            fieldRepository.save(new Field("Name"), "fieldId");

            // act
            const id = gameService.createGame(gameIn, "fieldId");

            // assert
            const gameOut = gameRepository.load(id);
            Assert.deepStrictEqual(gameOut?.id, id);
            Assert.deepStrictEqual(gameOut?.field?.name, "Name");
        });

        it('no matching field', () => {
            // arrange
            const gameIn = new Game();

            // act
            const executor = () => gameService.createGame(gameIn, "fieldId");

            // assert
            Assert.throws(executor, new ResourceNotFoundError(Field));
        });
    });

    it('get the list of all existing games', () => {
        // arrange
        gameRepository.save(new Game(), "key1");
        gameRepository.save(new Game(), "key2");

        // act
        const games = gameService.getGames();

        // assert
        Assert.deepStrictEqual(games.length, 2);
    });

    describe('manage an existing game', () => {
        it('get its state', () => {
            // arrange
            const gameIn = new Game();
            gameIn.id = "gameId";
            gameRepository.save(gameIn, gameIn.id);

            // act
            const gameOut = gameService.getGame(gameIn.id);

            // assert
            Assert.deepStrictEqual(gameOut?.id, gameIn.id);
        });

        it('add a player', () => {
            // arrange
            gameRepository.save(new Game(), "gameId");
            playerRepository.save(new Player("Player 1"), "player1");

            // act
            const gameOut = gameService.addPlayer("gameId", "player1");

            // assert
            Assert.deepStrictEqual(gameOut.players[0].name, "Player 1");
        });

        it('add a set of units for a given player', () => {
            // arrange
            const player = new Player("Player 1");
            player.id = "playerId";
            playerRepository.save(player, player.id);

            const game = new Game();
            game.addPlayers(player);
            gameRepository.save(game, "gameId");

            const unit = new Unit("Unit name");
            unitRepository.save(unit, "unitId");

            // act
            const gameOut = gameService.setUnits("gameId", "playerId", ["unitId"]);

            // assert
            Assert.deepStrictEqual(gameOut.getUnits("playerId").length, 1)
        });

        it('alternate turn between players', () => {
            // arrange
            const player1 = new Player("Player 1");
            const player2 = new Player("Player 2");
            playerRepository.save(player1, "player1");
            playerRepository.save(player2, "player2");

            let game = new Game();
            game.addPlayers(player1, player2);
            gameRepository.save(game, "gameId");

            // act
            game = gameService.startGame("gameId");
            const playerPerTurn = [];
            playerPerTurn.push(game.getCurrentPlayer());
            game = gameService.finishTurn("gameId");
            playerPerTurn.push(game.getCurrentPlayer());
            game = gameService.finishTurn("gameId");
            playerPerTurn.push(game.getCurrentPlayer());

            // assert
            Assert.deepStrictEqual(playerPerTurn[0]?.name, "Player 1");
            Assert.deepStrictEqual(playerPerTurn[1]?.name, "Player 2");
            Assert.deepStrictEqual(playerPerTurn[2]?.name, "Player 1");
        });
    });
});