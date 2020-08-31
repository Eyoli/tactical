import InMemoryRepository from "./in-memory-repository"
import { ActionType, TargetType, Range } from "../../../tactical/domain/model/action/action-type"
import { IdGenerator } from "../../generator/id-generator";
import { Damage, DamageType, Element } from "../../../tactical/domain/model/weapon";

class ActionTypeIdGenerator implements IdGenerator<ActionType, string> {

    generate(object: ActionType): string {
        return object.id;
    }
}

export default class InMemoryActionTypeRepository extends InMemoryRepository<ActionType> {

    constructor() {
        super(new ActionTypeIdGenerator());
        this.save(new ActionType("attack", TargetType.UNIT));
        this.save(new ActionType("fireball", TargetType.UNIT,
            new Range(1, 5, 2), new Damage(20, DamageType.MAGIC, Element.FIRE), new Range(0, 2, 1)));
    }
}