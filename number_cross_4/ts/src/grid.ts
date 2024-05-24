import { directions } from "./direction.js";
import type { Sequence } from "./index.js";
import type { Region } from "./region.js";

export type Coordinate = [x: number, y: number];
export const Shaded = Symbol("Shaded");
type Cell = null | number | typeof Shaded;
type RowConstraints = (number: number) => boolean;

export class Grid {
	private grid: Cell[][];

	constructor(
		private dimension: number,
		private regions: Region[] = [],
		private row_constraints: RowConstraints[] = [],
	) {
		this.grid = Array.from({ length: dimension }, () =>
			Array.from(
				{
					length: this.dimension,
				},
				() => null,
			),
		);
	}

	set(x: number, y: number, value: Cell) {
		if (!this.is_valid_coordinate(x, y)) {
			throw new Error(`(${x},${y}) is not a valid coordinate.`);
		}

		this.grid[y][x] = value;
	}

	static from_cells(
		/**
		 * Array of columns (rows outer array)
		 */
		cells: Cell[][],
		regions: Region[] = [],
		row_constraints: RowConstraints[] = [],
	) {
		const dimension = cells.length;

		if (!cells.every((row) => row.length === dimension)) {
			throw new Error("Non-square");
		}

		const grid = new Grid(dimension, regions, row_constraints);

		grid.grid = cells;

		return grid;
	}

	private get_shaded_cells(): Coordinate[] {
		const coordinates: Coordinate[] = [];

		for (let row = 0; row < this.dimension; row += 1) {
			for (let column = 0; column < this.dimension; column += 1) {
				if (this.grid[row][column] === Shaded) {
					coordinates.push([column, row]);
				}
			}
		}

		return coordinates;
	}

	get current_regions(): Coordinate[][] {
		const dynamic_regions: Coordinate[][] = [];
		const shaded_cells = this.get_shaded_cells();

		for (const region of this.regions) {
			const subregions = region.get_subregions(shaded_cells);

			dynamic_regions.push(...subregions);
		}

		return dynamic_regions;
	}

	private validate_region() {
		// Check that all cells in a (sub)region share the same value
		for (const region of this.current_regions) {
			let region_value = null;
			for (const [x, y] of region) {
				const cell_value = this.grid[y][x];

				if (cell_value === Shaded || cell_value === null) {
					continue;
				}

				if (region_value === null) {
					region_value = cell_value;
				} else if (region_value !== cell_value) {
					return {
						isValid: false,
						reason: `Region has two or more values: ${String(
							region_value,
						)} ${String(cell_value)}`,
					};
				}
			}
		}
		// Check that adjacent cells in different regions do not share the same value

		return {
			isValid: true,
		};
	}

	private static validate_sequence(sequence: Sequence) {
		if (sequence.length < 2) {
			throw new Error("Too short");
		}

		if (sequence[0] === 0) {
			return false;
		}

		return true;
	}

	validate() {
		const shading_validity = this.validate_shading();
		if (!shading_validity.isValid) {
			return shading_validity;
		}

		const row_validity = this.validate_rows();
		if (!row_validity.isValid) {
			return row_validity;
		}

		const region_validity = this.validate_region();
		if (!region_validity.isValid) {
			return region_validity;
		}

		return {
			isValid: true,
		};
	}

	private get_row(index: number) {
		if (index < 0 || index >= this.dimension) {
			throw new Error("Out of bounds");
		}

		return this.grid[index];
	}

	private build_subsequences(row_index: number) {
		const row = this.get_row(row_index);

		const subsequences = [];
		let subsequence = [];

		// Deal with leading 0?
		for (const element of row) {
			if (element === Shaded) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			if (element === null) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			subsequence.push(element);
		}

		if (subsequence.length > 0) {
			subsequences.push(subsequence);
			subsequence = [];
		}

		return subsequences;
	}

	private is_valid_coordinate(x: number, y: number): boolean {
		return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
	}

	private validate_rows() {
		for (const [row_index, rule] of this.row_constraints.entries()) {
			const subsequences = this.build_subsequences(row_index);

			for (const subsequence of subsequences) {
				if (!Grid.validate_sequence(subsequence)) {
					return { isValid: false, reason: `Invalid sequence: ${subsequence}` };
				}

				if (!rule(subsequence_to_number(subsequence))) {
					return {
						isValid: false,
						reason: `Broke rule in row ${row_index}: ${subsequence}`,
					};
				}
			}
		}

		return {
			isValid: true,
		};
	}

	private validate_shading() {
		for (let column = 0; column < this.dimension; column += 1) {
			for (let row = 0; row < this.dimension; row += 1) {
				const shaded = this.grid[column][row] === Shaded;

				if (!shaded) {
					continue;
				}

				for (const [dx, dy] of directions) {
					const x = column + dx;
					const y = row + dy;

					if (!this.is_valid_coordinate(x, y)) {
						continue;
					}

					if (this.grid[x][y] === Shaded) {
						return {
							isValid: false,
							reason: "Adjacent `Shaded` cells",
						};
					}
				}
			}
		}

		return {
			isValid: true,
		};
	}
}

// const grid = new Grid(2, []);
// console.log(grid);

function subsequence_to_number(sequence: Sequence) {
	return Number.parseInt(sequence.join(""));
}
