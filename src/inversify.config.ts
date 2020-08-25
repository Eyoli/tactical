import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";
import { FieldServicePort, GameServicePort, PlayerServicePort, UnitServicePort, FieldAlgorithmServicePort, ActionServicePort } from "./tactical/domain/port/primary/services";
import FieldService from "./tactical/adapter/primary/field-service";
import RepositoryPort from "./tactical/domain/port/secondary/repository-port";
import Field from "./tactical/domain/model/field";
import { InJsonFileRepository } from "./json-repository/adapter/in-json-file-repository";
import { FieldJsonMapper, UnitJsonMapper, PlayerJsonMapper } from "./json-repository/adapter/mapper/json-mappers";
import GameService from "./tactical/adapter/primary/game-service";
import Unit from "./tactical/domain/model/unit";
import Player from "./tactical/domain/model/player";
import Game from "./tactical/domain/model/game";
import PlayerService from "./tactical/adapter/primary/player-service";
import UnitService from "./tactical/adapter/primary/unit-service";
import FieldAlgorithmService from "./tactical/adapter/primary/field-algorithm-service";
import { GameJsonMapper } from "./json-repository/adapter/mapper/game-json-mapper";
import config from "config";
import InMemoryRepository from "./infrastructure/adapter/repository/in-memory-repository";
import TileBasedField from "./tactical/domain/model/tile-based-field/tile-based-field";
import ActionService from "./tactical/adapter/primary/action-service";
import Logger from "./tactical/domain/logger/logger";
import ConsoleLoggerService from "./infrastructure/adapter/console-logger-service";
import { CounterIdGenerator } from "./infrastructure/generator/id-generator";
import InMemoryActionTypeRepository from "./infrastructure/adapter/repository/in-memory-action-type-repository";

const iocContainer = new Container();

// JSON repository mappers
iocContainer.bind(TYPES.PLAYER_JSON_MAPPER).to(PlayerJsonMapper);
iocContainer.bind(TYPES.GAME_JSON_MAPPER).to(GameJsonMapper);
iocContainer.bind(TYPES.FIELD_JSON_MAPPER).to(FieldJsonMapper);
iocContainer.bind(TYPES.UNIT_JSON_MAPPER).to(UnitJsonMapper);

// Repositories
const persistenceType = config.get("persistence.type");
if (persistenceType === "in-memory") {
    iocContainer.bind(TYPES.FIELD_REPOSITORY)
        .toConstantValue(new InMemoryRepository<Field>(new CounterIdGenerator("field")));
    iocContainer.bind(TYPES.GAME_REPOSITORY)
        .toConstantValue(new InMemoryRepository<Game>(new CounterIdGenerator("game")));
    iocContainer.bind(TYPES.PLAYER_REPOSITORY)
        .toConstantValue(new InMemoryRepository<Player>(new CounterIdGenerator("player")));
    iocContainer.bind(TYPES.UNIT_REPOSITORY)
        .toConstantValue(new InMemoryRepository<Unit>(new CounterIdGenerator("unit")));
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
iocContainer.bind(TYPES.ACTION_TYPE_REPOSITORY).toConstantValue(new InMemoryActionTypeRepository());

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