import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IFieldService } from "./interfaces";
import FieldRepository from "../secondaries/map-repository";
import Field from "../models/field";

@injectable()
export default class FieldService implements IFieldService {
    private mapRepository: FieldRepository;

    constructor(@inject("FieldRepository") mapRepository: FieldRepository) {
        this.mapRepository = mapRepository;
    }

    getMap(key: string): Field {
        return this.mapRepository.load(key);
    }
}