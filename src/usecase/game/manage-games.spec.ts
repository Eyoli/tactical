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
import ResourceNotFoundError from "../../domain/error/resource-not-found-error";
import PlayerService from "../../domain/service/player-service";
import UnitService from "../../domain/service/unit-service";
import { FakeMovementService } from "../fake/services";

describe('About games we should be able to...', () => {

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

    describe('create a new game', () => {
        it('valid case', () => {
            // arrange
            const gameIn = new Game();
            const fieldId = fieldRepository.save(new Field("Name"));

            // act
            const id = gameService.createGame(gameIn, fieldId);

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
        gameRepository.save(new Game());
        gameRepository.save(new Game());

        // act
        const games = gameService.getGames();

        // assert
        Assert.deepStrictEqual(games.length, 2);
    });

    describe('manage an existing game', () => {

        it('get the current state of the game', () => {
            // arrange
            const gameIn = new Game();
            gameIn.id = gameRepository.save(gameIn);

            // act
            const gameOut = gameService.getGame(gameIn.id);

            // assert
            Assert.deepStrictEqual(gameOut?.id, gameIn.id);
        });

        it('add a player', () => {
            // arrange
            const gameId = gameRepository.save(new Game());
            const playerId = playerRepository.save(new Player("Player 1"));

            // act
            const gameOut = gameService.addPlayers(gameId, [playerId]);

            // assert
            Assert.deepStrictEqual(gameOut.players[0].name, "Player 1");
        });
    });
});