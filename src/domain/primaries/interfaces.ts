import Field from "../models/field";
import Player from "../models/player";

export interface IFieldService {
    saveField(field: Field, key: string): void;
    getField(key: string): Field | undefined;
    getFields(): Field[];
}

export interface IGameService {
    startGame(field: Field, players: Player): string;
}