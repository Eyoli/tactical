import { Weapon } from "./weapon";
import Statistics from "./statistics";

export default class Unit {
    id!: string;
    name!: string;
    private weapon!: Weapon;
    private statistics!: Statistics;

    constructor() {
    }

    withId(id: string): Unit {
        this.id = id;
        return this;
    }

    withName(name: string): Unit {
        this.name = name;
        return this;
    }

    withStatistics(statistics: Statistics): Unit {
        this.statistics = statistics;
        return this;
    }

    withWeapon(weapon: Weapon): Unit {
        this.weapon = weapon;
        return this;
    }

    getStatistics() {
        return this.statistics;
    }

    getWeapon() {
        return this.weapon;
    }
}