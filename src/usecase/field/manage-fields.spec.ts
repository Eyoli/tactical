import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import { FieldServicePort } from "../../tactical/domain/port/primary/services";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import FakeField from "../fake/fake-field";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import FieldService from "../../tactical/domain/service/field-service";
import Position from "../../tactical/domain/model/position";

describe('About fields we should be able to...', () => {

    let fieldService: FieldServicePort<Position>;
    let fieldRepository: RepositoryPort<FakeField>;

    beforeEach(() => {
        fieldRepository = new InMemoryRepository<FakeField>(new CounterIdGenerator("field"));
        fieldService = new FieldService<Position>(fieldRepository);
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
        fieldRepository.save(new FakeField("Name"), "field");

        // act
        const field = fieldService.getField("field");

        // assert
        Assert.deepStrictEqual(field.name, "Name");
    });

    it('get the list of all existing fields', () => {
        // arrange
        fieldRepository.save(new FakeField("Name"), "field1");
        fieldRepository.save(new FakeField("Name"), "field2");

        // act
        const fields = fieldService.getFields();

        // assert
        Assert.deepStrictEqual(fields.length, 2);
    });
});