export class GameErrorCode {
    readonly code: string;
    readonly message: string;

    static readonly IMPOSSIBLE_TO_MOVE_UNIT = new GameErrorCode("IMPOSSIBLE_TO_MOVE_UNIT", "Impossible to move this unit");
    static readonly GAME_ALREADY_STARTED = new GameErrorCode("GAME_ALREADY_STARTED", "Game has already started");
    static readonly NOT_ENOUGH_PLAYERS = new GameErrorCode("NOT_ENOUGH_PLAYERS", "Not enough players");
    static readonly NOT_ENOUGH_UNITS = new GameErrorCode("NOT_ENOUGH_UNITS", "Not enough units");
    static readonly INVALID_POSITION = new GameErrorCode("INVALID_POSITION", "There is an invalid position");
    static readonly IMPOSSIBLE_TO_ACT = new GameErrorCode("IMPOSSIBLE_TO_ACT", "Impossible to act");
    static readonly GAME_NOT_STARTED = new GameErrorCode("GAME_NOT_STARTED", "Game has not started yet");

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