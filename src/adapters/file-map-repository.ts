import { injectable } from "inversify";
import FieldRepository from "../secondaries/map-repository";
import Field from "../models/field";

@injectable()
export default class FileFieldRepository implements FieldRepository {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    save(map: Field, key: string) {
        throw new Error("Method not implemented");
    }

    load(key: string): Field {
        throw new Error("Method not implemented");
    }
}