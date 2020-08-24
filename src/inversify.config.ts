import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";
import { FieldServicePort, GameServicePort, PlayerServicePort, UnitServicePort, FieldAlgorithmServicePort, ActionServicePort } from "./tactical/domain/port/primary/services";
import FieldService from "./tactical/adapter/service/field-service";
import RepositoryPort from "./tactical/domain/port/secondary/repository";
import Field from "./tactical/domain/model/field";
import { InJsonFileRepository } from "./json-repository/adapter/in-json-file-repository";
import { FieldJsonMapper, UnitJsonMapper, PlayerJsonMapper } from "./json-repository/adapter/mapper/json-mappers";
import GameService from "./tactical/adapter/service/game-service";
import Unit from "./tactical/domain/model/unit";
import Player from "./tactical/domain/model/player";
import Game from "./tactical/domain/model/game";
import PlayerService from "./tactical/adapter/service/player-service";
import UnitService from "./tactical/adapter/service/unit-service";
import FieldAlgorithmService from "./tactical/adapter/service/field-algorithm-service";
import { GameJsonMapper } from "./json-repository/adapter/mapper/game-json-mapper";
import config from "config";
import InMemoryRepository from "./infrastructure/adapter/repository/in-memory-repository";
import TileBasedField from "./tactical/domain/model/tile-based-field/tile-based-field";
import ActionService from "./tactical/adapter/service/action-service";
import Logger from "./tactical/domain/logger/logger";
import ConsoleLoggerService from "./infrastructure/adapter/console-logger-service";

const iocContainer = new Container();

// JSON repository mappers
iocContainer.bind(TYPES.PLAYER_JSON_MAPPER).to(PlayerJsonMapper);
iocContainer.bind(TYPES.GAME_JSON_MAPPER).to(GameJsonMapper);
iocContainer.bind(TYPES.FIELD_JSON_MAPPER).to(FieldJsonMapper);
iocContainer.bind(TYPES.UNIT_JSON_MAPPER).to(UnitJsonMapper);

// Repositories
const persistenceType = config.get("persistence.type");
if (persistenceType === "in-memory") {
    iocContainer.bind(TYPES.FIELD_REPOSITORY).toConstantValue(new InMemoryRepository<Field>());
    iocContainer.bind(TYPES.GAME_REPOSITORY).toConstantValue(new InMemoryRepository<Game>());
    iocContainer.bind(TYPES.PLAYER_REPOSITORY).toConstantValue(new InMemoryRepository<Player>());
    iocContainer.bind(TYPES.UNIT_REPOSITORY).toConstantValue(new InMemoryRepository<Unit>());
} else if (persistenceType === "json") {
    const basePath = config.get("persistence.json.base-path");

    iocContainer.bind(TYPES.FIELD_REPOSITORY).toDynamicValue(
        ({ container }) => new InJsonFileRepository<Field>(container.get(TYPES.FIELD_JSON_MAPPER))
            .withBaseUrl(basePath + "/fields"))
    iocContainer.bind(TYPES.GAME_REPOSITORY).toDynamicValue(
        ({ container }) => new InJsonFileRepository<Game>(container.get(TYPES.GAME_JSON_MAPPER))
            .withBaseUrl(basePath + "/games"));
    iocContainer.bind<RepositoryPort<Player>>(TYPES.PLAYER_REPOSITORY).toDynamicValue(
        ({ container }) => new InJsonFileRepository<Player>(container.get(TYPES.PLAYER_JSON_MAPPER))
            .withBaseUrl(basePath + "/players"));
    iocContainer.bind(TYPES.UNIT_REPOSITORY).toDynamicValue(
        ({ container }) => new InJsonFileRepository<Unit>(container.get(TYPES.UNIT_JSON_MAPPER))
            .withBaseUrl(basePath + "/units"));
}

// Services
iocContainer.bind<FieldServicePort<TileBasedField>>(TYPES.FIELD_SERVICE).to(FieldService);
iocContainer.bind<GameServicePort>(TYPES.GAME_SERVICE).to(GameService);
iocContainer.bind<PlayerServicePort>(TYPES.PLAYER_SERVICE).to(PlayerService);
iocContainer.bind<UnitServicePort>(TYPES.UNIT_SERVICE).to(UnitService);
iocContainer.bind<FieldAlgorithmServicePort>(TYPES.FIELD_ALGORITHM_SERVICE).to(FieldAlgorithmService);
iocContainer.bind<ActionServicePort>(TYPES.ACTION_SERVICE).to(ActionService);

// Logging
if (config.get("logger") === true) {
    Logger.setLogger(new ConsoleLoggerService());
}

export default iocContainer;