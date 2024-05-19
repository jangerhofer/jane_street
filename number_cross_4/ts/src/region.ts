import type { Coordinate } from "./index.js";

export class Region {
	cells: Coordinate[];

	constructor(constituent_cells: Coordinate[], dimension: number) {
		for (const [x, y] of constituent_cells) {
			if (x > dimension - 1 || y > dimension - 1) {
				throw new Error(`Invalid coordinate: [${x}, ${y}] in region.`);
			}
		}

		this.cells = constituent_cells;
	}
}
