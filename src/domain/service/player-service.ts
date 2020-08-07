import { injectable, inject } from "inversify";
import { IPlayerService } from "../port/primary/services";
import Repository from "../port/secondary/repository";
import { TYPES } from "../../types";
import Player from "../model/player";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class PlayerService implements IPlayerService {
    private playerService: Repository<Player>;

    public constructor(@inject(TYPES.PLAYER_REPOSITORY) playerService: Repository<Player>) {
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
            throw new ResourceNotFoundError(Player);
        }
        return player;
    }
}