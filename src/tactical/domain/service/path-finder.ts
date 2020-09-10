import { Graph, Path } from "../model/path/graph";

class NodeState<N> {
	tested: boolean;
	cost: number;
	previous: N | null;

	constructor() {
		this.tested = false;
		this.cost = Infinity;
		this.previous = null;
	}
}

type PositionMapping<P, N> = (p: P) => N;
type EdgeFilter<N> = (n1: N, n2: N) => boolean;

export class PathFinderManager<N> {
	constructor() {
	}

	static PathFinder = class PathFinder<N> {
		readonly graph: Graph<N>;
		readonly startNode: N;
		readonly endNode: N;
		private readonly nodesState: Map<N, NodeState<N>>;
		private neighbourFilter?: EdgeFilter<N>;

		constructor(graph: Graph<N>, startNode: N, endNode: N) {
			this.graph = graph;
			this.startNode = startNode;
			this.endNode = endNode;
			this.nodesState = new Map();
		}

		withNeighbourFilter(filter: EdgeFilter<N>) {
			this.neighbourFilter = filter;
			return this;
		}

		private getNodeState(key: N,) {
			let state = this.nodesState.get(key);
			if (!state) {
				state = new NodeState();
				this.nodesState.set(key, state);
			}
			return state;
		}

		find(): Path<N> {
			const endNodeKey = this.graph.getNodeKey(this.endNode);

			let currentNode = this.startNode;
			this.getNodeState(currentNode).cost = 0;
			const candidates: N[] = [];

			while (currentNode
				&& this.graph.getNodeKey(currentNode) !== endNodeKey) {
				//console.log('node: ', currentNode);

				const currentNodeState = this.getNodeState(currentNode);
				currentNodeState.tested = true;
				const cost = currentNodeState.cost;

				let neighbours = this.graph.getNeighbours(currentNode);
				if (this.neighbourFilter) {
					neighbours = neighbours.filter(node => this.neighbourFilter!(currentNode, node));
				}
				//console.log('neighbours: ', neighbours);

				for (let neighbour of neighbours) {
					const state = this.getNodeState(neighbour);
					const costToNode = this.graph.costBetween(currentNode, neighbour);
					if (!state.tested) {
						if (state.cost === Infinity) {
							candidates.push(neighbour);
						}
						if (state.cost > cost + costToNode) {
							state.cost = cost + costToNode;
							state.previous = currentNode;
						}
					}
				}

				//console.log('candidates: ', candidates);

				let nextEstimatedCost = Infinity;
				let nextIndex: number = 0;

				candidates.forEach((candidate, i) => {
					const state = this.getNodeState(candidate);
					const estimatedCost = state.cost + this.graph.distanceBetween(candidate, this.endNode);
					if (nextEstimatedCost > estimatedCost) {
						nextEstimatedCost = estimatedCost;
						nextIndex = i;
					}
				});

				const candidate = candidates.splice(nextIndex, 1);
				currentNode = candidate[0];
			}

			if (currentNode) {
				const totalCost = this.getNodeState(currentNode).cost;
				const shortestPath = [];
				shortestPath.push(currentNode);

				let state = this.getNodeState(currentNode);
				while (state.previous) {
					shortestPath.unshift(state.previous);
					state = this.getNodeState(state.previous);
				}

				return new Path(shortestPath, totalCost);
			}

			return new Path([], Infinity);
		}
	}

	getShortestPathFromPosition<P>(graph: Graph<N>, getClosestNode: PositionMapping<P, N>, start: P, end: P) {
		const startNode = getClosestNode(start);
		const endNode = getClosestNode(end);
		return new PathFinderManager.PathFinder(graph, startNode, endNode);
	}

	getShortestPath(graph: Graph<N>, startNode: N, endNode: N) {
		return new PathFinderManager.PathFinder(graph, startNode, endNode);
	}
}