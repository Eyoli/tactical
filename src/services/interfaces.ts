import Field from "../models/field";

export interface IFieldService {
    getMap(key: string): Field;
}