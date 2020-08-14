import { injectable, inject } from "inversify";
import { FieldServicePort as FieldServicePort } from "../port/primary/services";
import Field from "../model/field";
import RepositoryPort from "../port/secondary/repository";
import { TYPES } from "../../types";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class FieldService<T extends Field> implements FieldServicePort<T> {
    private fieldRepository: RepositoryPort<T>;

    public constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<T>) {
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