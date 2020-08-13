import { injectable, inject } from "inversify";
import { IFieldService } from "../port/primary/services";
import Field from "../model/field";
import Repository from "../port/secondary/repository";
import { TYPES } from "../../types";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class FieldService<T extends Field> implements IFieldService<T> {
    private fieldRepository: Repository<T>;

    public constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: Repository<T>) {
        this.fieldRepository = fieldRepository;
    }

    getFields(): T[] {
        return this.fieldRepository.loadAll();
    }

    createField(field: T): string {
        field.withId(this.fieldRepository.save(field));
        return field.id;
    }

    getField(fieldId: string): T {
        const field = this.fieldRepository.load(fieldId);
        if(!field) {
            throw new ResourceNotFoundError("Field");
        }
        return field;
    }
}