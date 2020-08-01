import { injectable, inject } from "inversify";
import { IPlayerService } from "../port/primary/services";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import { TYPES } from "../../types";
import Player from "../model/player";

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
        player.id = UUID.v4();
        this.playerService.save(player, player.id);
        return player.id;
    }

    getPlayer(key: string): Player {
        const player = this.playerService.load(key);
        if(!player) {
            throw new Error("Player not found");
        }
        return player;
    }
}