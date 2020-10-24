import Field from "../../../tactical/domain/model/field/field";
import Game from "../../../tactical/domain/model/game";
import Player from "../../../tactical/domain/model/player";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types";
import RepositoryPort from "../../../tactical/domain/port/secondary/repository-port";
import JsonMapperPort from "../../port/json-mapper-port";
import Position from "../../../tactical/domain/model/position";
import ResourceNotFoundError from "../../../tactical/domain/model/error/resource-not-found-error";

@injectable()
export class GameJsonMapper implements JsonMapperPort<Game> {
    private fieldRepository: RepositoryPort<Field<Position>>;
    private playerRepository: RepositoryPort<Player>;

    constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<Field<Position>>,
        @inject(TYPES.PLAYER_REPOSITORY) playerRepository: RepositoryPort<Player>) {
        this.fieldRepository = fieldRepository;
        this.playerRepository = playerRepository;
    }

    fromJson(json: any): Game {
        const field = this.fieldRepository.load(json.fieldId);
        if (!field) {
            throw ResourceNotFoundError.fromClass(Field);
        }
        return new Game.Builder()
            .withId(json.id)
            .withField(field)
            .withPlayers(...this.playerRepository.loadSome(json.playerIds))
            .build();
    }

    toJson(object: Game): any {
        return {
            id: object.id,
            fieldId: object.field?.id,
            playerIds: object.players.map(p => p.id)
        };
    }
}