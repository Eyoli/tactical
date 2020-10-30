import InMemoryRepository from "./in-memory-repository"
import { ActionType, TargetType, Range } from "../../tactical/domain/model/action/action-type"
import IdGenerator from "../port/id-generator";
import { Damage } from "../../tactical/domain/model/weapon";
import { DamageType, Element } from "../../tactical/domain/model/enums";

class EmptyIdGenerator implements IdGenerator<string> {
    generate(): string {
        throw new Error("Method not implemented.");
    }
}

export default class InMemoryActionTypeRepository extends InMemoryRepository<ActionType> {

    constructor() {
        super(new EmptyIdGenerator());
        this.save(new ActionType("attack", TargetType.UNIT), "attack");
        this.save(new ActionType("fireball", TargetType.UNIT,
            new Range(1, 5, 2), new Damage(20, DamageType.MAGIC, Element.FIRE), new Range(0, 2, 1)), "fireball");
    }
}