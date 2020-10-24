import "reflect-metadata";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import Game from "../../tactical/domain/model/game";
import Field from "../../tactical/domain/model/field/field";
import Player from "../../tactical/domain/model/player";
import Unit from "../../tactical/domain/model/unit";
import * as Assert from "assert";
import * as mocha from "mocha";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import { GameServicePort } from "../../tactical/domain/port/primary/services";
import ResourceNotFoundError from "../../tactical/domain/model/error/resource-not-found-error";
import { FakeFieldAlgorithmService } from "../fake/fake-field-algorithm-service";
import FakeField from "../fake/fake-field";
import FakeActionService from "../fake/fake-action-service";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import GameService from "../../tactical/domain/service/game-service";
import PlayerService from "../../tactical/domain/service/player-service";
import UnitService from "../../tactical/domain/service/unit-service";
import Position from "../../tactical/domain/model/position";

describe('About games we should be able to...', () => {

    let gameService: GameServicePort;
    let playerRepository: RepositoryPort<Player>;
    let gameRepository: RepositoryPort<Game>;
    let unitRepository: RepositoryPort<Unit>;
    let fieldRepository: RepositoryPort<Field<Position>>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>(new CounterIdGenerator("player"));
        gameRepository = new InMemoryRepository<Game>(new CounterIdGenerator("game"));
        unitRepository = new InMemoryRepository<Unit>(new CounterIdGenerator("unit"));
        fieldRepository = new InMemoryRepository<Field<Position>>(new CounterIdGenerator("field"));

        gameService = new GameService(
            gameRepository, 
            new PlayerService(playerRepository),
            new UnitService(unitRepository), 
            fieldRepository, 
            new FakeFieldAlgorithmService(),
            new FakeActionService());
    });

    describe('create a new game', () => {
        it('valid case', () => {
            // arrange
            const gameIn = new Game.Builder().build();
            const fieldId = fieldRepository.save(new FakeField("Name"));

            // act
            const id = gameService.createGame(gameIn, fieldId);

            // assert
            const gameOut = gameRepository.load(id);
            Assert.deepStrictEqual(gameOut?.id, id);
        });

        it('no matching field', () => {
            // arrange
            const gameIn = new Game.Builder().build();

            // act
            const executor = () => gameService.createGame(gameIn, "fieldId");

            // assert
            Assert.throws(executor, new ResourceNotFoundError("Field"));
        });
    });

    it('get the list of all existing games', () => {
        // arrange
        gameRepository.save(new Game.Builder().build());
        gameRepository.save(new Game.Builder().build());

        // act
        const games = gameService.getGames();

        // assert
        Assert.deepStrictEqual(games.length, 2);
    });

    describe('manage an existing game', () => {

        it('get the current state of the game', () => {
            // arrange
            const gameIn = new Game.Builder().build();
            gameIn.id = gameRepository.save(gameIn);

            // act
            const gameOut = gameService.getGame(gameIn.id);

            // assert
            Assert.deepStrictEqual(gameOut?.id, gameIn.id);
        });

        it('add a player', () => {
            // arrange
            const gameId = gameRepository.save(new Game.Builder().build());
            const playerId = playerRepository.save(new Player("Player 1"));

            // act
            const gameOut = gameService.addPlayers(gameId, [playerId]);

            // assert
            Assert.deepStrictEqual(gameOut.players[0].name, "Player 1");
        });
    });
});