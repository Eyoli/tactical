import InMemoryRepository from "./in-memory-repository"
import { ActionType, TargetType, RangeType } from "../../../tactical/domain/model/action/action-type"
import { IdGenerator } from "../../generator/id-generator";

class ActionTypeIdGenerator implements IdGenerator<ActionType, string> {

    generate(object: ActionType): string {
        return object.id;
    }
}

export default class InMemoryActionTypeRepository extends InMemoryRepository<ActionType> {

    constructor() {
        super(new ActionTypeIdGenerator());
        this.save(new ActionType("attack", TargetType.UNIT, RangeType.WEAPON));
    }
}