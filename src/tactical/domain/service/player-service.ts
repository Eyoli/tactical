import { injectable, inject } from "inversify";
import { PlayerServicePort } from "../../domain/port/primary/services";
import RepositoryPort from "../../domain/port/secondary/repository-port";
import { TYPES } from "../../../types";
import Player from "../../domain/model/player";
import ResourceNotFoundError from "../../domain/model/error/resource-not-found-error";

@injectable()
export default class PlayerService implements PlayerServicePort {
    private playerRepository: RepositoryPort<Player>;

    public constructor(@inject(TYPES.PLAYER_REPOSITORY) playerRepository: RepositoryPort<Player>) {
        this.playerRepository = playerRepository;
    }

    getPlayers(): Player[] {
        return this.playerRepository.loadAll();
    }

    createPlayer(player: Player): string {
        player.id = this.playerRepository.getId();
        this.playerRepository.save(player, player.id);
        return player.id;
    }

    getPlayer(key: string): Player {
        const player = this.playerRepository.load(key);
        if(!player) {
            throw ResourceNotFoundError.fromClass(Player);
        }
        return player;
    }
}