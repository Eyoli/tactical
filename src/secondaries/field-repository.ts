import Field from "../models/field";

export default interface FieldRepository {
    save(field: Field, key: string): void;
    load(key: string): Field | undefined;
    loadAll(): Field[];
}