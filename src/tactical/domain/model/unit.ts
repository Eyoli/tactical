import { Weapon } from "./weapon";
import Statistics from "./statistics";

export default class Unit {
    id!: string;
    name!: string;
    weapon!: Readonly<Weapon>;
    statistics!: Statistics;

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
}