import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";
import { IFieldService, IGameService, IPlayerService, IUnitService, IMovementService } from "./domain/port/primary/services";
import FieldService from "./domain/service/field-service";
import Repository from "./domain/port/secondary/repository";
import Field from "./domain/model/field";
import { InJsonFileRepository } from "./infrastructure/adapter/secondary/in-json-file-repository";
import { FieldJsonMapper, UnitJsonMapper, PlayerJsonMapper } from "./infrastructure/json/json-mappers";
import GameService from "./domain/service/game-service";
import Unit from "./domain/model/unit";
import Player from "./domain/model/player";
import Game from "./domain/model/game";
import PlayerService from "./domain/service/player-service";
import UnitService from "./domain/service/unit-service";
import MovementService from "./domain/service/movement-service";
import { GameJsonMapper } from "./infrastructure/json/game-json-mapper";
import config from "config";
import InMemoryRepository from "./infrastructure/adapter/secondary/in-memory-repository";

const iocContainer = new Container();

// Mappers
iocContainer.bind(TYPES.PLAYER_JSON_MAPPER).to(PlayerJsonMapper);
iocContainer.bind(TYPES.GAME_JSON_MAPPER).to(GameJsonMapper);
iocContainer.bind(TYPES.FIELD_JSON_MAPPER).to(FieldJsonMapper);
iocContainer.bind(TYPES.UNIT_JSON_MAPPER).to(UnitJsonMapper);

// Repositories
if (config.get("env") === "api-test") {
    iocContainer.bind(TYPES.FIELD_REPOSITORY).toConstantValue(new InMemoryRepository<Field>());
    iocContainer.bind(TYPES.GAME_REPOSITORY).toConstantValue(new InMemoryRepository<Game>());
    iocContainer.bind(TYPES.PLAYER_REPOSITORY).toConstantValue(new InMemoryRepository<Player>());
    iocContainer.bind(TYPES.UNIT_REPOSITORY).toConstantValue(new InMemoryRepository<Unit>());
} else {
    const basePath = config.get("persistence.json.base-path");

    iocContainer.bind(TYPES.FIELD_REPOSITORY)
    .toDynamicValue(({container}) => new InJsonFileRepository<Field>(container.get(TYPES.FIELD_JSON_MAPPER))
        .withBaseUrl(basePath + "/fields"))
    iocContainer.bind(TYPES.GAME_REPOSITORY)
        .toDynamicValue(({container}) => new InJsonFileRepository<Game>(container.get(TYPES.GAME_JSON_MAPPER))
            .withBaseUrl(basePath + "/games"));
    iocContainer.bind<Repository<Player>>(TYPES.PLAYER_REPOSITORY)
        .toDynamicValue(({container}) => new InJsonFileRepository<Player>(container.get(TYPES.PLAYER_JSON_MAPPER))
                .withBaseUrl(basePath + "/players"));
    iocContainer.bind(TYPES.UNIT_REPOSITORY)
        .toDynamicValue(({container}) => new InJsonFileRepository<Unit>(container.get(TYPES.UNIT_JSON_MAPPER))
            .withBaseUrl(basePath + "/units"));
}

// Services
iocContainer.bind<IFieldService>(TYPES.FIELD_SERVICE).to(FieldService);
iocContainer.bind<IGameService>(TYPES.GAME_SERVICE).to(GameService);
iocContainer.bind<IPlayerService>(TYPES.PLAYER_SERVICE).to(PlayerService);
iocContainer.bind<IUnitService>(TYPES.UNIT_SERVICE).to(UnitService);
iocContainer.bind<IMovementService>(TYPES.MOVEMENT_SERVICE).to(MovementService);

export default iocContainer;