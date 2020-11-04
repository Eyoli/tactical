import { Direction } from "../../tactical/domain/model/enums";
import Game from "../../tactical/domain/model/game";
import { KillThemAll } from "../../tactical/domain/model/goal";
import Player from "../../tactical/domain/model/player";
import Position from "../../tactical/domain/model/position";
import Statistics from "../../tactical/domain/model/statistics";
import Unit from "../../tactical/domain/model/unit";
import UnitState from "../../tactical/domain/model/unit-state";
import * as Assert from "assert";
import TurnManager from "../../tactical/domain/model/turn-manager";

describe('About goals...', () => {

    it('kill them all', () => {
        // arrange
        const player1 = new Player("Player1").withId("player1");
        const player2 = new Player("Player2").withId("player2");
        const unit1 = new Unit().withId("unit1")
            .withStatistics(new Statistics.Builder()
                .withHealth(10)
                .withSpeed(1)
                .build());
        const unit2 = new Unit().withId("unit2")
            .withStatistics(new Statistics.Builder()
                .withHealth(0)
                .withSpeed(2)
                .build());
        const game = new Game.Builder()
            .withPlayers(player1, player2)
            .withUnit(player1, unit1)
            .withUnit(player2, unit2)
            .withGoals(player1, new KillThemAll(player1))
            .withGoals(player2, new KillThemAll(player2))
            .build()
            .start(new TurnManager());

        // act
        game.integrate(true,
            UnitState.init(unit1, new Position(0, 0, 0), Direction.DOWN),
            UnitState.init(unit2, new Position(0, 0, 0), Direction.DOWN));

        // assert
        Assert.deepStrictEqual(game.finished(), true);
        Assert.deepStrictEqual(game.winner?.id, player1.id);
    });
})