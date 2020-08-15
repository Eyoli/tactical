import { injectable, inject } from "inversify";
import { PlayerServicePort } from "../port/primary/services";
import RepositoryPort from "../port/secondary/repository";
import { TYPES } from "../../types";
import Player from "../model/player";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class PlayerService implements PlayerServicePort {
    private playerService: RepositoryPort<Player>;

    public constructor(@inject(TYPES.PLAYER_REPOSITORY) playerService: RepositoryPort<Player>) {
        this.playerService = playerService;
    }

    getPlayers(): Player[] {
        return this.playerService.loadAll();
    }

    createPlayer(player: Player): string {
        player.id = this.playerService.save(player);
        return player.id;
    }

    getPlayer(key: string): Player {
        const player = this.playerService.load(key);
        if(!player) {
            throw ResourceNotFoundError.fromClass(Player);
        }
        return player;
    }
}