import { FieldAlgorithmServicePort } from "../../domain/port/primary/services";
import Field from "../../domain/model/field";
import Position from "../../domain/model/position";
import { Set } from "immutable";
import { injectable } from "inversify";
import UnitState from "../../domain/model/unit-state";

type PositionSearch = [Position, number];
type CostFunction = (p: Position) => number;

@injectable()
export default class FieldAlgorithmService implements FieldAlgorithmServicePort {

    getPositionsInRange(field: Field, start: Position, range: number, height: number): Position[] {
        return this.getAccessiblePositionsAsSet(field, start, range, height, p => 1).toArray();
    }

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return this.getAccessiblePositionsAsSet(
            field,
            unitState.getPosition(),
            unitState.getMoves(),
            unitState.getJumps(),
            p => field.getCost(p))
            .toArray();
    }

    private getAccessiblePositionsAsSet(field: Field, start: Position, moves: number, jumps: number,
        costFunction: CostFunction): Set<Position> {
        const accessiblePositions = Set<Position>().asMutable();
        const searches: PositionSearch[] = [[start, moves]];

        while (searches.length > 0) {
            const currentSearch = searches.shift();
            if (currentSearch) {
                accessiblePositions.add(currentSearch[0]);
                searches.push(...field.getNeighbours(currentSearch[0])
                    .map(p => {
                        const search: PositionSearch = [p, currentSearch[1] - costFunction(p)];
                        return search;
                    })
                    .filter(search => field.isNeighbourAccessible(currentSearch[0], search[0], currentSearch[1], jumps)));
            }
        }
        return accessiblePositions;
    }

    isAccessible(field: Field, unitState: UnitState, p: Position): boolean {
        if (unitState.getPosition().equals(p)) {
            return false;
        }

        const accessiblePositions = this.getAccessiblePositionsAsSet(
            field,
            unitState.getPosition(),
            unitState.getMoves(),
            unitState.getJumps(),
            p => field.getCost(p));
        return accessiblePositions.has(p);
    }
}