import "reflect-metadata";
import * as Assert from "assert";
import FieldService from "../../domain/service/field-service";
import Field from "../../domain/model/field";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import { IFieldService } from "../../domain/port/primary/services";
import Repository from "../../domain/port/secondary/repository";
import TileBasedField from "../../domain/model/tile-based-field";

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
        const id = fieldService.createField(new TileBasedField("Name"));

        // assert
        const field = fieldRepository.load(id);
        Assert.deepStrictEqual(field?.name, "Name");
    });

    it('get an existing field', () => {
        // arrange
        const fieldId = fieldRepository.save(new TileBasedField("Name"));

        // act
        const field = fieldService.getField(fieldId);

        // assert
        Assert.deepStrictEqual(field.name, "Name");
    });

    it('get the list of all existing fields', () => {
        // arrange
        fieldRepository.save(new TileBasedField("Name"));
        fieldRepository.save(new TileBasedField("Name"));

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepStrictEqual(fields.length, 2);
    });
});