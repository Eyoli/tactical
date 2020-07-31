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
import { IGameService } from "../../domain/port/primary/interfaces";

describe('About games we should be able to...', () => {

    let gameService: IGameService;
    let playerRepository: Repository<Player>;
    let gameRepository: Repository<Game>;
    let unitRepository: Repository<Unit>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>();
        gameRepository = new InMemoryRepository<Game>();
        unitRepository = new InMemoryRepository<Unit>();
        
        gameService = new GameService(gameRepository, playerRepository, unitRepository);
    });

    it('start a new game', () => {
        // arrange
        const gameIn = new Game();
        gameIn.field = new Field("Name");

        // act
        const id = gameService.createGame(gameIn);

        // assert
        const gameOut = gameRepository.load(id);
        Assert.deepEqual(gameOut?.id, id);
        Assert.deepEqual(gameOut?.field?.name, "Name");
    });

    it('get an existing game', () => {
        // arrange
        const gameIn = new Game();
        gameIn.id = "gameId";
        gameRepository.save(gameIn, gameIn.id);

        // act
        const gameOut = gameService.getGame(gameIn.id);

        // assert
        Assert.deepEqual(gameOut?.id, gameIn.id);
    });

    it('add a set of units for a given player', () => {
        // arrange
        const player = new Player("Player 1");
        player.id = "playerId";
        playerRepository.save(player, player.id);

        const game = new Game();
        game.field = new Field("Name");
        game.addPlayer(player);
        gameRepository.save(game, "gameId");

        const unit = new Unit("Unit name");
        unitRepository.save(unit, "unitId");

        // act
        const gameOut = gameService.setUnits("gameId", "playerId", ["unitId"]);

        // assert
        Assert.deepEqual(gameOut.getUnits("playerId").length, 1)
    });
});