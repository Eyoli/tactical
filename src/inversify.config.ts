import { Container } from "inversify";
import "reflect-metadata";
import { IFieldService } from "./services/interfaces";
import FieldService from "./services/field-service";
import FieldRepository from "./secondaries/field-repository";
import FileFieldRepository from "./adapters/file-field-repository";
import { TYPES } from "./types";

const iocContainer = new Container();
iocContainer.bind<IFieldService>(TYPES.FIELD_SERVICE).to(FieldService);
iocContainer.bind<FieldRepository>(TYPES.FILE_REPOSITORY).to(FileFieldRepository);

export { iocContainer };