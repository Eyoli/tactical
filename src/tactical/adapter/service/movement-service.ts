import { MovementServicePort } from "../../domain/port/primary/services";
import Field from "../../domain/model/field";
import Position from "../../domain/model/position";
import { Set } from "immutable";
import { injectable } from "inversify";
import UnitState from "../../domain/model/unit-state";

type PositionSearch = [Position, number];

@injectable()
export default class MovementService implements MovementServicePort {

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return this.getAccessiblePositionsAsSet(field, unitState).toArray();
    }

    private getAccessiblePositionsAsSet(field: Field, unitState: UnitState): Set<Position> {
        const accessiblePositions = Set<Position>().asMutable();
        const searches: PositionSearch[] = [[unitState.getPosition(), unitState.getMoves()]];

        while(searches.length > 0) {
            const currentSearch = searches.shift();
            if(currentSearch) {
                accessiblePositions.add(currentSearch[0]);
                searches.push(...this.getNeighbours(field, currentSearch[0], currentSearch[1])
                    .filter(search => field.isNeighbourAccessible(currentSearch[0], search[0], currentSearch[1], unitState.getJumps()))    
                    .filter(search => !accessiblePositions.has(search[0])));
            }
        }
        return accessiblePositions;
    }

    private getNeighbours(field: Field, p: Position, moves: number): PositionSearch[] {
        return field.getNeighbours(p)
            .map(p2 => {
                return [p2, moves - field.getCost(p2)];
            });
    }

    isAccessible(field: Field, unitState: UnitState, p: Position): boolean {
        if(unitState.getPosition().equals(p)) {
            return false;
        }

        const accessiblePositions = this.getAccessiblePositionsAsSet(field, unitState);
        return accessiblePositions.has(p);
    }
}