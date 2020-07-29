import Field from "../models/field";

export interface IFieldService {
    saveField(field: Field, key: string): void;
    getField(key: string): Field | undefined;
    getFields(): Field[];
}