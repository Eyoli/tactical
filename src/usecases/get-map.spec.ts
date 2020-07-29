import { iocContainer } from "../inversify.config";
import * as Assert from "assert";
import FieldService from "../services/map-service";
import FieldRepository from "../secondaries/map-repository";
import Field from "../models/field";

class InMemoryFieldRepository implements FieldRepository {
    private maps: Map<string, Field>;

    constructor() {
        this.maps = new Map();
    }

    save(field: Field, key: string): void {
        this.maps.set(key, field);
    }

    load(key: string): Field | undefined {
        return this.maps.get(key);
    }
}

describe('About maps we should be able to...', () => {

    const mapService = new FieldService(new InMemoryFieldRepository());

    it('get a map correctly', () => {
    });

});