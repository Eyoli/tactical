import { injectable, inject } from "inversify";
import { FieldServicePort as FieldServicePort } from "../../domain/port/primary/services";
import Field from "../../domain/model/field";
import RepositoryPort from "../../domain/port/secondary/repository-port";
import { TYPES } from "../../../types";
import ResourceNotFoundError from "../../domain/model/error/resource-not-found-error";

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

    updateField(field: T, id: string): void {
        this.fieldRepository.update(field, id);
    }

    getField(id: string): T {
        const field = this.fieldRepository.load(id);
        if(!field) {
            throw new ResourceNotFoundError("Field");
        }
        return field;
    }
}