import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";

import { IFieldService, IGameService } from "./domain/port/primary/interfaces";
import FieldService from "./domain/service/field-service";
import Repository from "./domain/port/secondary/repository";
import Field from "./domain/model/field";
import { InJsonFileRepository } from "./infrastructure/adapter/secondary/in-json-file-repository";
import { FieldJsonMapper, UnitJsonMapper, GameJsonMapper, PlayerJsonMapper } from "./infrastructure/json/json-mappers";
import GameService from "./domain/service/game-service";
import Unit from "./domain/model/unit";
import Player from "./domain/model/player";
import Game from "./domain/model/game";

const iocContainer = new Container();

// Repositories
iocContainer.bind<Repository<Field>>(TYPES.FIELD_REPOSITORY)
    .toConstantValue(new InJsonFileRepository<Field>(new FieldJsonMapper(), "data/fields"));
iocContainer.bind<Repository<Game>>(TYPES.GAME_REPOSITORY)
    .toConstantValue(new InJsonFileRepository<Game>(new GameJsonMapper(), "data/games"));
iocContainer.bind<Repository<Player>>(TYPES.PLAYER_REPOSITORY)
    .toConstantValue(new InJsonFileRepository<Player>(new PlayerJsonMapper(), "data/players"));
iocContainer.bind<Repository<Unit>>(TYPES.UNIT_REPOSITORY)
    .toConstantValue(new InJsonFileRepository<Unit>(new UnitJsonMapper(), "data/units"));

// Services
iocContainer.bind<IFieldService>(TYPES.FIELD_SERVICE).to(FieldService);
iocContainer.bind<IGameService>(TYPES.GAME_SERVICE).to(GameService);

export default iocContainer;