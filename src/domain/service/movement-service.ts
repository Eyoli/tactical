import { IMovementService } from "../port/primary/services";
import Field from "../model/field";
import Position from "../model/position";
import { Set } from "immutable";
import { injectable } from "inversify";
import { UnitState } from "../model/unit-state";

type PositionSearch = [Position, number];

@injectable()
export default class MovementService implements IMovementService {

    getAccessiblePositions(field: Field, unitState: UnitState): Position[] {
        return this.getAccessiblePositionsAsSet(field, unitState).toArray();
    }

    private getAccessiblePositionsAsSet(field: Field, unitState: UnitState): Set<Position> {
        const accessiblePositions = Set<Position>().asMutable();
        const searches: PositionSearch[] = [[unitState.position, unitState.moves]];

        while(searches.length > 0) {
            const currentSearch = searches.shift();
            if(currentSearch) {
                accessiblePositions.add(currentSearch[0]);
                searches.push(...this.getNeighbours(field, currentSearch[0], currentSearch[1])
                    .filter(search => field.isNeighbourAccessible(currentSearch[0], search[0], currentSearch[1], unitState.jumps))    
                    .filter(search => !accessiblePositions.has(search[0])));
            }
        }
        return accessiblePositions;
    }

    private getNeighbours(field: Field, p: Position, moves: number): PositionSearch[] {
        const positionsToCheck: Position[] = [];
        if(p.x > 0) {
            positionsToCheck.push(new Position(p.x-1, p.y));
        }
        if(p.x < field.getTiles().length-1) {
            positionsToCheck.push(new Position(p.x+1, p.y));
        }
        if(p.y > 0) {
            positionsToCheck.push(new Position(p.x, p.y-1));
        }
        if(p.y < field.getTiles()[p.x].length-1) {
            positionsToCheck.push(new Position(p.x, p.y+1));
        }

        return positionsToCheck
            .map(p2 => {
                const tile = field.getTopTile(p2);
                return [p2, moves - tile.cost];
            });
    }

    isAccessible(field: Field, unitState: UnitState, p: Position): boolean {
        if(unitState.position.equals(p)) {
            return false;
        }

        const accessiblePositions = this.getAccessiblePositionsAsSet(field, unitState);
        return accessiblePositions.has(p);
    }
}