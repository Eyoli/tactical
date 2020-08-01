import "reflect-metadata";
import * as Assert from "assert";
import InMemoryRepository from "../../infrastructure/adapter/secondary/in-memory-repository";
import { IUnitService } from "../../domain/port/primary/services";
import Repository from "../../domain/port/secondary/repository";
import UnitService from "../../domain/service/unit-service";
import Unit from "../../domain/model/unit";

describe('About units we should be able to...', () => {

    let unitService: IUnitService;
    let unitRepository: Repository<Unit>;

    beforeEach(() => {
        unitRepository = new InMemoryRepository<Unit>(); 
        unitService = new UnitService(unitRepository);
    });

    it('save a unit', () => {
        // arrange
        // act
        const id = unitService.createUnit(new Unit("Name"));

        // assert
        const unit = unitRepository.load(id);
        Assert.deepEqual(unit?.name, "Name");
    });

    it('get an existing unit', () => {
        // arrange
        unitRepository.save(new Unit("Name"), "key");

        // act
        const unit = unitService.getUnit("key");

        // assert
        Assert.deepEqual(unit.name, "Name");
    });

    it('get the list of all existing units', () => {
        // arrange
        unitRepository.save(new Unit("Name"), "key1");
        unitRepository.save(new Unit("Name"), "key2");

        // act
        const units = unitService.getUnits();

        // assert
        Assert.deepEqual(units.length, 2);
    });

});