import Game from "../../tactical/domain/model/game";

export default class GameDTO {
    private readonly state: string;
    private readonly players: any;

    constructor(game: Game) {
        this.state = game.getState();
        this.players = game.players;
        for(let player of this.players) {
            player.units = game.getUnits(player);
        }
    }
}