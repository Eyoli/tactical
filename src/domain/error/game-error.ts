export class GameErrorCode {
    readonly code: string;
    readonly message: string;

    static IMPOSSIBLE_TO_MOVE_UNIT = new GameErrorCode("IMPOSSIBLE_TO_MOVE_UNIT", "Impossible to move this unit");
    static GAME_ALREADY_STARTED = new GameErrorCode("GAME_ALREADY_STARTED", "Game has already started");
    static NOT_ENOUGH_PLAYERS = new GameErrorCode("NOT_ENOUGH_PLAYERS", "Not enough players");
    static NOT_ENOUGH_UNITS = new GameErrorCode("NOT_ENOUGH_UNITS", "Not enough units");
    static INVALID_POSITION = new GameErrorCode("INVALID_POSITION", "There is an invalid position");

    private constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class GameError extends Error {
    code: string;

    constructor(type: GameErrorCode) {
        super(type.message);
        this.code = type.code;
    }
}