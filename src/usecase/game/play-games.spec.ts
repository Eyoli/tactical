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

describe('When playing we should be able to...', () => {

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
        
        gameService = new GameService(gameRepository, playerRepository, unitRepository, fieldRepository);
    });

    describe('manage an existing game', () => {

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