import "reflect-metadata";
import * as Assert from "assert";
import FieldService from "../../domain/service/field-service";
import Field from "../../domain/model/field";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import { IFieldService } from "../../domain/port/primary/services";
import Repository from "../../domain/port/secondary/repository";

describe('About fields we should be able to...', () => {

    let fieldService: IFieldService;
    let fieldRepository: Repository<Field>;

    beforeEach(() => {
        fieldRepository = new InMemoryRepository<Field>(); 
        fieldService = new FieldService(fieldRepository);
    });

    it('save a field', () => {
        // arrange
        // act
        const id = fieldService.createField(new Field("Name"));

        // assert
        const field = fieldRepository.load(id);
        Assert.deepEqual(field?.name, "Name");
    });

    it('get an existing field', () => {
        // arrange
        fieldRepository.save(new Field("Name"), "key");

        // act
        const field = fieldService.getField("key");

        // assert
        Assert.deepEqual(field.name, "Name");
    });

    it('get the list of all existing fields', () => {
        // arrange
        fieldRepository.save(new Field("Name"), "key1");
        fieldRepository.save(new Field("Name"), "key2");

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepEqual(fields.length, 2);
    });

});