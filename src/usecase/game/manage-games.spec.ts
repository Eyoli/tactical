import "reflect-metadata";
import InMemoryRepository from "../../infrastructure/adapter/repository/in-memory-repository";
import GameService from "../../tactical/adapter/service/game-service";
import Game from "../../tactical/domain/model/game";
import Field from "../../tactical/domain/model/field";
import Player from "../../tactical/domain/model/player";
import Unit from "../../tactical/domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import RepositoryPort from "../../tactical/domain/port/secondary/repository";
import { GameServicePort } from "../../tactical/domain/port/primary/services";
import ResourceNotFoundError from "../../tactical/domain/model/error/resource-not-found-error";
import PlayerService from "../../tactical/adapter/service/player-service";
import UnitService from "../../tactical/adapter/service/unit-service";
import { FakeMovementService } from "../fake/services";
import FakeField from "../fake/fake-field";
import FakeActionService from "../fake/fake-action-service";

describe('About games we should be able to...', () => {

    let gameService: GameServicePort;
    let playerRepository: RepositoryPort<Player>;
    let gameRepository: RepositoryPort<Game>;
    let unitRepository: RepositoryPort<Unit>;
    let fieldRepository: RepositoryPort<Field>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>();
        gameRepository = new InMemoryRepository<Game>();
        unitRepository = new InMemoryRepository<Unit>();
        fieldRepository = new InMemoryRepository<Field>();

        gameService = new GameService(
            gameRepository, 
            new PlayerService(playerRepository),
            new UnitService(unitRepository), 
            fieldRepository, 
            new FakeMovementService(),
            new FakeActionService());
    });

    describe('create a new game', () => {
        it('valid case', () => {
            // arrange
            const gameIn = new Game();
            const fieldId = fieldRepository.save(new FakeField("Name"));

            // act
            const id = gameService.createGame(gameIn, fieldId);

            // assert
            const gameOut = gameRepository.load(id);
            Assert.deepStrictEqual(gameOut?.id, id);
        });

        it('no matching field', () => {
            // arrange
            const gameIn = new Game();

            // act
            const executor = () => gameService.createGame(gameIn, "fieldId");

            // assert
            Assert.throws(executor, new ResourceNotFoundError("Field"));
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