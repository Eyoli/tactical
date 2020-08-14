import "reflect-metadata";
import * as Assert from "assert";
import FieldService from "../../domain/service/field-service";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import { FieldServicePort } from "../../domain/port/primary/services";
import RepositoryPort from "../../domain/port/secondary/repository";
import FakeField from "../fake/fake-field";

describe('About fields we should be able to...', () => {

    let fieldService: FieldServicePort<FakeField>;
    let fieldRepository: RepositoryPort<FakeField>;

    beforeEach(() => {
        fieldRepository = new InMemoryRepository<FakeField>(); 
        fieldService = new FieldService<FakeField>(fieldRepository);
    });

    it('save a field', () => {
        // arrange
        // act
        const id = fieldService.createField(new FakeField("Name"));

        // assert
        const field = fieldRepository.load(id);
        Assert.deepStrictEqual(field?.name, "Name");
    });

    it('get an existing field', () => {
        // arrange
        const fieldId = fieldRepository.save(new FakeField("Name"));

        // act
        const field = fieldService.getField(fieldId);

        // assert
        Assert.deepStrictEqual(field.name, "Name");
    });

    it('get the list of all existing fields', () => {
        // arrange
        fieldRepository.save(new FakeField("Name"));
        fieldRepository.save(new FakeField("Name"));

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepStrictEqual(fields.length, 2);
    });
});