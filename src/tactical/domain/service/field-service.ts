import { injectable, inject } from "inversify";
import { FieldServicePort as FieldServicePort } from "../../domain/port/primary/services";
import Field from "../model/field/field";
import RepositoryPort from "../../domain/port/secondary/repository-port";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../../domain/model/error/resource-not-found-error";
import { ValueObject } from "immutable";

@injectable()
export default class FieldService<T extends ValueObject> implements FieldServicePort<T> {
    private fieldRepository: RepositoryPort<Field<T>>;

    public constructor(
        @inject(TYPES.FIELD_REPOSITORY) fieldRepository: RepositoryPort<Field<T>>) {
        this.fieldRepository = fieldRepository;
    }

    getFields(): Field<T>[] {
        return this.fieldRepository.loadAll();
    }

    createField(field: Field<T>): string {
        field.id = this.fieldRepository.getId();
        this.fieldRepository.save(field, field.id);
        return field.id;
    }

    updateField(field: Field<T>, id: string): void {
        this.fieldRepository.update(field, id);
    }

    getField(id: string): Field<T> {
        const field = this.fieldRepository.load(id);
        if (!field) {
            throw ResourceNotFoundError.fromClass(Field);
        }
        return field;
    }
}