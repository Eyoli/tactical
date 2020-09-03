import TurnManager from "../../tactical/domain/model/turn-manager";
import Unit from "../../tactical/domain/model/unit";
import Statistics from "../../tactical/domain/model/statistics";
import * as Assert from "assert";
import * as mocha from "mocha";

describe('A turn manager...', () => {

    it('should sort unit based on speed', () => {
        // arrange
        const unit1 = new Unit().withId("unit1").withStatistics(new Statistics().withSpeed(1));
        const unit2 = new Unit().withId("unit2").withStatistics(new Statistics().withSpeed(3));
        const unit3 = new Unit().withId("unit3").withStatistics(new Statistics().withSpeed(2));
        const turnManager = new TurnManager([unit1, unit2, unit3]);

        // act
        const units = [];
        units.push(turnManager.getCurrentUnit());
        turnManager.next();
        units.push(turnManager.getCurrentUnit());
        turnManager.next();
        units.push(turnManager.getCurrentUnit());

        // assert
        Assert.deepStrictEqual(units[0].id, unit2.id);
        Assert.deepStrictEqual(units[1].id, unit3.id);
        Assert.deepStrictEqual(units[2].id, unit1.id);
    });

});