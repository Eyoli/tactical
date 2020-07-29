import { injectable } from "inversify";
import FieldRepository from "../secondaries/field-repository";
import Field from "../models/field";
import fs from "fs";

@injectable()
export default class FileFieldRepository implements FieldRepository {
    private baseUrl: string;

    constructor() {
        this.baseUrl = "../fields";
    }

    save(map: Field, key: string) {
        throw new Error("Method not implemented");
    }

    load(key: string): Field | undefined {
        return this.parseField(key + ".json");
    }

    loadAll(): Field[] {
        return fs.readdirSync(this.baseUrl)
            .map(fileName => this.parseField(fileName));
    }

    private parseField(key: string): Field {
        const json = JSON.parse(fs.readFileSync(this.baseUrl + "/" + key, 'utf8'));
        const field = new Field();
        field.key = key.split(".")[0];
        field.name = json.name;
        return field;
    }
}