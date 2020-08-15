import Position from "./position";
import Statistics from "./statistics";

type UnitsComposition = Map<string, Map<string, Position>>;
type UnitsPlacement = Map<string, Position>;
type Effect = (statistics: Statistics) => Statistics;

export { UnitsComposition, UnitsPlacement };