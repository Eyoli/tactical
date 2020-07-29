import FieldRepository from "../../secondaries/field-repository";
import Field from "../../models/field";

export default class InMemoryFieldRepository implements FieldRepository {
    private maps: Map<string, Field>;

    constructor() {
        this.maps = new Map();
    }

    loadAll(): Field[] {
        return Array.from(this.maps.values());
    }

    save(field: Field, key: string): void {
        this.maps.set(key, field);
    }

    load(key: string): Field | undefined {
        return this.maps.get(key);
    }
}