import Field from "../../domain/model/field";
import Game from "../../domain/model/game";
import Player from "../../domain/model/player";
import { injectable, inject } from "inversify";
import { TYPES } from "../../types";
import Repository from "../../domain/port/secondary/repository";

export interface JsonMapper<T> {
    fromJson(json: any): T;
    toJson(object: T): any;
}

@injectable()
export class GameJsonMapper implements JsonMapper<Game> {
    private fieldRepository: Repository<Field>;
    private playerRepository: Repository<Player>;

    constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<Field>,
        @inject(TYPES.PLAYER_REPOSITORY) playerRepository: Repository<Player>) {
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