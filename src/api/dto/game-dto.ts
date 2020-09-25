import Game from "../../tactical/domain/model/game";
import UnitState from "../../tactical/domain/model/unit-state";

export default class GameDTO {
    private readonly state: string;
    private readonly players: any;
    private readonly id: string;
    private readonly fieldId: string | undefined;
    private readonly unitStates?: UnitState[];
    private readonly currentUnitState?: UnitState;

    constructor(game: Game) {
        this.id = game.id;
        this.fieldId = game.field?.id;
        this.state = game.getState();
        this.players = game.players;
        for(const player of this.players) {
            player.units = game.getUnits(player);
        }
        
        const currentUnitId = game.getCurrentUnit()?.id;
        if (currentUnitId) {
            this.unitStates = game.getUnitStates();
            this.currentUnitState = game.getUnitState(currentUnitId);
        }
    }
}