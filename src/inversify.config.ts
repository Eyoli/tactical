import { Container } from "inversify";
import "reflect-metadata";
import { IFieldService } from "./domain/primaries/interfaces";
import FieldService from "./domain/services/field-service";
import Repository from "./domain/secondaries/repository";
import InFileFieldRepository from "./adapters/file-field-repository";
import { TYPES } from "./types";
import Field from "./domain/models/field";

const iocContainer = new Container();
iocContainer.bind<IFieldService>(TYPES.FIELD_SERVICE).to(FieldService);
iocContainer.bind<Repository<Field>>(TYPES.FILE_REPOSITORY).to(InFileFieldRepository);

export { iocContainer };