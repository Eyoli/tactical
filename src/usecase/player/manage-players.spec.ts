import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../infrastructure/adapter/repository/in-memory-repository";
import { PlayerServicePort } from "../../domain/port/primary/services";
import RepositoryPort from "../../domain/port/secondary/repository";
import Player from "../../domain/model/player";
import PlayerService from "../../domain/service/player-service";

describe('About players we should be able to...', () => {

    let playerService: PlayerServicePort;
    let playerRepository: RepositoryPort<Player>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>(); 
        playerService = new PlayerService(playerRepository);
    });

    it('save a player', () => {
        // arrange
        // act
        const id = playerService.createPlayer(new Player("Name"));

        // assert
        const player = playerRepository.load(id);
        Assert.deepStrictEqual(player?.name, "Name");
    });

    it('get an existing player', () => {
        // arrange
        const playerId = playerRepository.save(new Player("Name"));

        // act
        const player = playerService.getPlayer(playerId);

        // assert
        Assert.deepStrictEqual(player.name, "Name");
    });

    it('get the list of all existing players', () => {
        // arrange
        playerRepository.save(new Player("Name"));
        playerRepository.save(new Player("Name"));

        // act
        const players = playerService.getPlayers();

        // assert
        Assert.deepStrictEqual(players.length, 2);
    });

});