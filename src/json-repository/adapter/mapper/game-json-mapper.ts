import Field from "../../../tactical/domain/model/field";
import Game from "../../../tactical/domain/model/game";
import Player from "../../../tactical/domain/model/player";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types";
import RepositoryPort from "../../../tactical/domain/port/secondary/repository";
import JsonMapperPort from "../../port/json-mapper-port";

@injectable()
export class GameJsonMapper implements JsonMapperPort<Game> {
    private fieldRepository: RepositoryPort<Field>;
    private playerRepository: RepositoryPort<Player>;

    constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<Field>,
        @inject(TYPES.PLAYER_REPOSITORY) playerRepository: RepositoryPort<Player>) {
        this.fieldRepository = fieldRepository;
        this.playerRepository = playerRepository;
    }

    fromJson(json: any): Game {
        const game = new Game();
        game.id = json.id;
        game.field = this.fieldRepository.load(json.fieldId);
        game.players = this.playerRepository.loadSome(json.playerIds);
        return game;
    }

    toJson(object: Game): any {
        return {
            id: object.id,
            fieldId: object.field?.id,
            playerIds: object.players.map(p => p.id)
        };
    }
}