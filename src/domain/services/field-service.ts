import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IFieldService } from "../primaries/interfaces";
import Field from "../models/field";
import { TYPES } from "../../types";
import Repository from "../secondaries/repository";

@injectable()
export default class FieldService implements IFieldService {
    private fieldRepository: Repository<Field>;

    public constructor(@inject(TYPES.FILE_REPOSITORY) fieldRepository: Repository<Field>) {
        this.fieldRepository = fieldRepository;
    }

    getFields(): Field[] {
        return this.fieldRepository.loadAll();
    }

    saveField(field: Field, key: string): void {
        this.fieldRepository.save(field, key);
    }

    getField(key: string): Field | undefined {
        return this.fieldRepository.load(key);
    }
}