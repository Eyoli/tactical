import * as Assert from "assert";
import FieldService from "../../domain/service/field-service";
import Field from "../../domain/model/field";
import InMemoryRepository from "../in-memory-repository";

describe('About fields we should be able to...', () => {

    it('save then get a field', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryRepository<Field>());

        // act
        const id = fieldService.createField(new Field("Name"));
        const field = fieldService.getField(id);

        // assert
        Assert.deepEqual(field.id, id);
    });

    it('get the list of all existing fields', () => {
        // arrange
        const fieldService = new FieldService(new InMemoryRepository<Field>());
        fieldService.createField(new Field("Name"));
        fieldService.createField(new Field("Name"));

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepEqual(fields.length, 2);
    });

});