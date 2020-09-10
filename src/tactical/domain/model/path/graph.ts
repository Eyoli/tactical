export interface Graph<N> {
	getNeighbours(node: N): N[];
	getNodeKey(node: N) : string;
	costBetween(node: N, neighbour: N): number;
	distanceBetween(node1: N, node2: N): number;
}

export class Path<N> {
	path: N[];
	cost: number;

	constructor(path: N[], cost: number) {
		this.path = path;
		this.cost = cost;
	}
}