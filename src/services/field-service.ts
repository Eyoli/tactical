import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IFieldService } from "./interfaces";
import FieldRepository from "../secondaries/field-repository";
import Field from "../models/field";
import { TYPES } from "../types";

@injectable()
export default class FieldService implements IFieldService {
    private mapRepository: FieldRepository;

    public constructor(@inject(TYPES.FILE_REPOSITORY) mapRepository: FieldRepository) {
        this.mapRepository = mapRepository;
    }

    getFields(): Field[] {
        return this.mapRepository.loadAll();
    }

    saveField(field: Field, key: string): void {
        this.mapRepository.save(field, key);
    }

    getField(key: string): Field | undefined {
        return this.mapRepository.load(key);
    }
}