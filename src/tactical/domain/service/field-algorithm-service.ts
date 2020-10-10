import { FieldAlgorithmServicePort } from "../../domain/port/primary/services";
import Position from "../../domain/model/position";
import { Set } from "immutable";
import { injectable } from "inversify";
import UnitState from "../../domain/model/unit-state";
import { Range } from "../../domain/model/action/action-type";
import { PathFinderManager } from "./path-finder";
import Field from "../model/field/field";

type PositionSearch = [Position, number];
type CostFunction = (p1: Position, p2: Position) => number;

@injectable()
export default class FieldAlgorithmService implements FieldAlgorithmServicePort {
    private pathFinderManager: PathFinderManager<Position>;

    constructor() {
        this.pathFinderManager = new PathFinderManager<Position>();
    }

    getShortestPath(field: Field<Position>, start: Position, end: Position, jumps: number): Position[] {
        return this.pathFinderManager.getShortestPath(field, start, end)
            .withNeighbourFilter((p1: Position, p2: Position) => Math.abs(p2.z - p1.z) <= jumps)
            .find()
            .path;
    }

    getPositionsInRange(field: Field<Position>, position: Position, range: Range): Position[] {
        return this.getAccessiblePositionsAsSet(
            field, position, range.max, range.height, () => 1)
            .filter(p => position.flatDistanceTo(p) >= range.min)
            .toArray();
    }

    getAccessiblePositions(field: Field<Position>, unitState: UnitState): Position[] {
        return this.getAccessiblePositionsAsSet(
            field,
            unitState.position,
            unitState.getMoves(),
            unitState.getJumps(),
            (p1, p2) => field.costBetween(p1, p2))
            .toArray();
    }

    private getAccessiblePositionsAsSet(field: Field<Position>, start: Position, moves: number, jumps: number,
        costFunction: CostFunction): Set<Position> {
        const accessiblePositions = Set<Position>().asMutable();
        const searches: PositionSearch[] = [[start, moves]];

        while (searches.length > 0) {
            const currentSearch = searches.shift();
            if (currentSearch) {
                accessiblePositions.add(currentSearch[0]);
                searches.push(...Array.from(field.getNeighbours(currentSearch[0]))
                    .map(p => {
                        const search: PositionSearch = [p, currentSearch[1] - costFunction(currentSearch[0], p)];
                        return search;
                    })
                    .filter(search => costFunction(currentSearch[0], search[0]) <= currentSearch[1]
                        && field.getHeightDifference(currentSearch[0], search[0]) <= jumps));
            }
        }
        return accessiblePositions;
    }

    isAccessible(field: Field<Position>, unitState: UnitState, p: Position): boolean {
        if (unitState.position.equals(p)) {
            return false;
        }

        const accessiblePositions = this.getAccessiblePositionsAsSet(
            field,
            unitState.position,
            unitState.getMoves(),
            unitState.getJumps(),
            (p1, p2) => field.costBetween(p1, p2));
        return accessiblePositions.has(p);
    }
}