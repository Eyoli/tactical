import { IGameService } from "../port/primary/interfaces";
import Player from "../model/player";
import Game from "../model/game";
import { inject, injectable } from "inversify";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import Unit from "../model/unit";
import { TYPES } from "../../types";

@injectable()
export default class GameService implements IGameService {
    private gameRepository: Repository<Game>;
    private playerRepository: Repository<Player>;
    private unitRepository: Repository<Unit>;

    constructor(
        @inject(TYPES.GAME_REPOSITORY) gameRepository: Repository<Game>,
        @inject(TYPES.PLAYER_REPOSITORY) playerRepository: Repository<Player>,
        @inject(TYPES.UNIT_REPOSITORY) unitRepository: Repository<Unit>) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.unitRepository = unitRepository;
    }

    createGame(game: Game): string {
        game.id = UUID.v4();
        this.gameRepository.save(game, game.id);
        return game.id;
    }

    getGame(key: string): Game {
        const game = this.gameRepository.load(key);
        if(!game) {
            throw new Error("Game not found");
        }
        return game;
    }

    setUnits(gameId: string, playerId: string, unitIds: string[]): Game {
        const game = this.gameRepository.load(gameId);
        const player = this.playerRepository.load(playerId);
        const units = this.unitRepository.loadSome(unitIds);

        if(!game) {
            throw new Error("Invalid game");
        }

        if(!player) {
            throw new Error("Invalid player");
        }

        if(units.length !== unitIds.length) {
            throw new Error("At least one invalid unit");
        }

        game.setUnits(player, units);
        this.gameRepository.update(game, gameId);

        return game;
    }
}