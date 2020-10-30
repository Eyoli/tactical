import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../in-memory-repository/adapter/in-memory-repository";
import { UnitServicePort } from "../../tactical/domain/port/primary/services";
import RepositoryPort from "../../tactical/domain/port/secondary/repository-port";
import Unit from "../../tactical/domain/model/unit";
import CounterIdGenerator from "../../in-memory-repository/adapter/counter-id-generator";
import UnitService from "../../tactical/domain/service/unit-service";

describe('About units we should be able to...', () => {

    let unitService: UnitServicePort;
    let unitRepository: RepositoryPort<Unit>;

    beforeEach(() => {
        unitRepository = new InMemoryRepository<Unit>(new CounterIdGenerator("unit"));
        unitService = new UnitService(unitRepository);
    });

    it('save a unit', () => {
        // arrange
        // act
        const id = unitService.createUnit(new Unit());

        // assert
        const unit = unitRepository.load(id);
        Assert.deepStrictEqual(unit?.id, id);
    });

    it('get an existing unit', () => {
        // arrange
        unitRepository.save(new Unit().withName("name"), "unit1");

        // act
        const unit = unitService.getUnit("unit1");

        // assert
        Assert.deepStrictEqual(unit.name, "name");
    });

    it('get a list of existing units', () => {
        // arrange
        unitRepository.save(new Unit(), "unit1");
        unitRepository.save(new Unit(), "unit2");
        unitRepository.save(new Unit(), "unit3");

        // act
        const units = unitService.getUnits(["unit1", "unit2"]);

        // assert
        Assert.deepStrictEqual(units.length, 2);
    });

    it('get the list of all existing units', () => {
        // arrange
        unitRepository.save(new Unit(), "unit1");
        unitRepository.save(new Unit(), "unit2");

        // act
        const units = unitService.getUnits();

        // assert
        Assert.deepStrictEqual(units.length, 2);
    });

});