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
import Position from "../../domain/model/position";
import { UnitStateBuilder } from "../../domain/model/unit-state";
import { UnitsComposition, UnitsPlacement } from "../../domain/model/aliases";

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
        it('get its state', () => {
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

        it('moving a unit', () => {
            // arrange
            const game = aStartedGame();
            const player1 = game.players[0];
            const unit1 = game.getUnits(player1)[0];
            game.setUnitState(unit1, new UnitStateBuilder()
                .init(unit1, new Position(0,0))
                .build());

            // act
            const newUnitState = gameService.moveUnit(game.id, player1.id, unit1.id, new Position(1,1));

            // assert
            Assert.deepStrictEqual(newUnitState.position.equals(new Position(1,1)), true);
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
        player1UnitsPlacement.set(unit1.id, new Position(0,0));
        const player2UnitsPlacement: UnitsPlacement = new Map();
        player2UnitsPlacement.set(unit2.id, new Position(0,0));
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