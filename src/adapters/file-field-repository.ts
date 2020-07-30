import Field from "../domain/models/field";
import InFileRepository from "./in-file-repository";

export default class InFileFieldRepository extends InFileRepository<Field> {

    parseJson(key: string, json: any): Field {
        const field = new Field();
        field.key = key;
        field.name = json.name;
        return field;
    }
}