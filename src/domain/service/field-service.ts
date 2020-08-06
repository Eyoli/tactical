import { injectable, inject } from "inversify";
import { IFieldService } from "../port/primary/services";
import Field from "../model/field";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import { TYPES } from "../../types";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class FieldService implements IFieldService {
    private fieldRepository: Repository<Field>;

    public constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<Field>) {
        this.fieldRepository = fieldRepository;
    }

    getFields(): Field[] {
        return this.fieldRepository.loadAll();
    }

    createField(field: Field): string {
        field.id = UUID.v4();
        this.fieldRepository.save(field, field.id);
        return field.id;
    }

    getField(fieldId: string): Field {
        const field = this.fieldRepository.load(fieldId);
        if(!field) {
            throw new ResourceNotFoundError(Field);
        }
        return field;
    }
}