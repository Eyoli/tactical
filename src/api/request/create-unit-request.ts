import Unit from "../../domain/model/unit";

export default class CreateUnitRequest {
    name!: string;
    moves!: number;
    jumps!: number;

    constructor(input: any) {
        this.name = input.name;
        this.moves = input.moves;
        this.jumps = input.jumps;
    }

    validate(): string[] {
        const warnings = [];
        if(!this.name) {
            warnings.push("name is required")
        }
        if(!this.moves) {
            warnings.push("moves is required")
        }
        if(!this.jumps) {
            warnings.push("jumps is required")
        }
        return warnings;
    }

    toUnit(): Unit {
        const unit = new Unit(this.name)
            .withJumps(this.jumps)
            .withMoves(this.moves);
        return unit;
    }
}