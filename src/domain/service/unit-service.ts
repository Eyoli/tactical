import { injectable, inject } from "inversify";
import { IUnitService } from "../port/primary/services";
import Repository from "../port/secondary/repository";
import { TYPES } from "../../types";
import Unit from "../model/unit";
import ResourceNotFoundError from "../error/resource-not-found-error";

@injectable()
export default class UnitService implements IUnitService {
    private unitRepository: Repository<Unit>;

    public constructor(@inject(TYPES.UNIT_REPOSITORY) unitRepository: Repository<Unit>) {
        this.unitRepository = unitRepository;
    }

    getUnits(ids?: string[]): Unit[] {
        if(ids) {
            const units = this.unitRepository.loadSome(ids);
            if(units.length !== ids.length) {
                throw new ResourceNotFoundError(Unit);
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
            throw new ResourceNotFoundError(Unit);
        }
        return unit;
    }
}