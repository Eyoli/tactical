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
        Assert.deepStrictEqual(unit?.name, "Name");
    });

    it('get an existing unit', () => {
        // arrange
        const unitId = unitRepository.save(new Unit("Name"));

        // act
        const unit = unitService.getUnit(unitId);

        // assert
        Assert.deepStrictEqual(unit.name, "Name");
    });

    it('get a list of existing units', () => {
        // arrange
        const id1 = unitRepository.save(new Unit("Name1"));
        const id2 = unitRepository.save(new Unit("Name2"));
        unitRepository.save(new Unit("Name3"));

        // act
        const units = unitService.getUnits([id1, id2]);

        // assert
        Assert.deepStrictEqual(units.length, 2);
    });

    it('get the list of all existing units', () => {
        // arrange
        unitRepository.save(new Unit("Name"));
        unitRepository.save(new Unit("Name"));

        // act
        const units = unitService.getUnits();

        // assert
        Assert.deepStrictEqual(units.length, 2);
    });

});