import { Container } from "inversify";
import "reflect-metadata";
import { IFieldService } from "./services/interfaces";
import FieldService from "./services/map-service";
import FieldRepository from "./secondaries/map-repository";
import FileMapRepository from "./adapters/file-map-repository";

const iocContainer = new Container();
iocContainer.bind<IFieldService>("FieldService").to(FieldService);
iocContainer.bind<FieldRepository>("FieldRepository").to(FileMapRepository);

export { iocContainer };