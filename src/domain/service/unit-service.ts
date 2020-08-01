import { injectable, inject } from "inversify";
import { IUnitService } from "../port/primary/services";
import Repository from "../port/secondary/repository";
import * as UUID from "uuid";
import { TYPES } from "../../types";
import Unit from "../model/unit";

@injectable()
export default class UnitService implements IUnitService {
    private unitRepository: Repository<Unit>;

    public constructor(@inject(TYPES.UNIT_REPOSITORY) unitRepository: Repository<Unit>) {
        this.unitRepository = unitRepository;
    }

    getUnits(): Unit[] {
        return this.unitRepository.loadAll();
    }

    createUnit(unit: Unit): string {
        unit.id = UUID.v4();
        this.unitRepository.save(unit, unit.id);
        return unit.id;
    }

    getUnit(key: string): Unit {
        const unit = this.unitRepository.load(key);
        if(!unit) {
            throw new Error("Unit not found");
        }
        return unit;
    }
}