import * as Assert from "assert";
import FieldService from "../../domain/services/field-service";
import Field from "../../domain/models/field";
import InMemoryRepository from "../in-memory-repository";

describe('About fields we should be able to...', () => {

    it('save then get a field', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryRepository<Field>());

        // act
        fieldService.saveField(new Field(), "key");
        const field = fieldService.getField("key");

        // assert
        Assert.notEqual(field, undefined);
    });

    it('get the list of all existing fields', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryRepository<Field>());
        fieldService.saveField(new Field(), "key1");
        fieldService.saveField(new Field(), "key2");

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepEqual(fields.length, 2);
    });

});