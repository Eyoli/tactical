import { injectable, inject } from "inversify";
import { UnitServicePort } from "../port/primary/services";
import RepositoryPort from "../port/secondary/repository";
import { TYPES } from "../../types";
import Unit from "../model/unit";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class UnitService implements UnitServicePort {
    private unitRepository: RepositoryPort<Unit>;

    public constructor(@inject(TYPES.UNIT_REPOSITORY) unitRepository: RepositoryPort<Unit>) {
        this.unitRepository = unitRepository;
    }

    getUnits(ids?: string[]): Unit[] {
        if(ids) {
            const units = this.unitRepository.loadSome(ids);
            if(units.length !== ids.length) {
                throw ResourceNotFoundError.fromClass(Unit);
            }
            return units;
        }
        
        return this.unitRepository.loadAll();
    }

    createUnit(unit: Unit): string {
        unit.id = this.unitRepository.save(unit);
        return unit.id;
    }

    getUnit(key: string): Unit {
        const unit = this.unitRepository.load(key);
        if(!unit) {
            throw ResourceNotFoundError.fromClass(Unit);
        }
        return unit;
    }
}