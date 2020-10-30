import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import { PlayerServicePort } from "../../tactical/domain/port/primary/services";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import Player from "../../tactical/domain/model/player";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import PlayerService from "../../tactical/domain/service/player-service";

describe('About players we should be able to...', () => {

    let playerService: PlayerServicePort;
    let playerRepository: RepositoryPort<Player>;

    beforeEach(() => {
        playerRepository = new InMemoryRepository<Player>(new CounterIdGenerator("player"));
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
        playerRepository.save(new Player("Name"), "player1");

        // act
        const player = playerService.getPlayer("player1");

        // assert
        Assert.deepStrictEqual(player.name, "Name");
    });

    it('get the list of all existing players', () => {
        // arrange
        playerRepository.save(new Player("Name"), "player1");
        playerRepository.save(new Player("Name"), "player2");

        // act
        const players = playerService.getPlayers();

        // assert
        Assert.deepStrictEqual(players.length, 2);
    });

});