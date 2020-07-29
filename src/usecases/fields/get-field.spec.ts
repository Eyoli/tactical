import * as Assert from "assert";
import FieldService from "../../services/field-service";
import FieldRepository from "../../secondaries/field-repository";
import Field from "../../models/field";
import InMemoryFieldRepository from "./in-memory-field-repository";

describe('About fields we should be able to...', () => {

    it('save then get a field', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryFieldRepository());

        // act
        fieldService.saveField(new Field(), "key");
        const field = fieldService.getField("key");

        // assert
        Assert.notEqual(field, undefined);
    });

    it('get the list of all existing fields', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryFieldRepository());
        fieldService.saveField(new Field(), "key1");
        fieldService.saveField(new Field(), "key2");

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepEqual(fields.length, 2);
    });

});