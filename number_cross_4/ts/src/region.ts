import { directions } from "./direction.js";
import type { Coordinate } from "./grid.js";

export class Region {
	cells: Coordinate[];

	constructor(constituent_cells: Coordinate[]) {
		this.cells = constituent_cells;
	}

	get_subregions(shaded_cells: Coordinate[]): Coordinate[][] {
		const subregions: Coordinate[][] = [];

		const shaded_set = new Set(shaded_cells.map(buildKey));
		const visited = new Set<string>();

		for (const cell of this.cells) {
			const key = buildKey(cell);

			if (!visited.has(key) && !shaded_set.has(key)) {
				const subregion = this.bfs(cell, shaded_set, visited);
				if (subregion.length > 0) {
					subregions.push(subregion);
				}
			}
		}

		return subregions;
	}

	private bfs(
		start: Coordinate,
		shaded_set: Set<string>,
		visited: Set<string>,
	) {
		const queue = [start];
		const subregion: Coordinate[] = [];

		while (queue.length) {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const cell = queue.shift()!;
			const key = buildKey(cell);
			if (visited.has(key) || shaded_set.has(key)) {
				continue;
			}

			visited.add(key);
			subregion.push(cell);

			const [x, y] = cell;

			for (const [dx, dy] of directions) {
				const nx = x + dx;
				const ny = y + dy;

				const n_key = buildKey([nx, ny]);

				if (
					this.has_cell(nx, ny) &&
					!visited.has(n_key) &&
					!shaded_set.has(n_key)
				) {
					queue.push([nx, ny]);
				}
			}
		}

		return subregion;
	}

	has_cell(x: number, y: number) {
		for (const cell of this.cells) {
			if (cell[0] === x && cell[1] === y) {
				return true;
			}
		}

		return false;
	}
}

const separator = "__";

function buildKey(cell: Coordinate) {
	return [cell[0], cell[1]].join(separator);
}
