import { Cell, type Value } from "./cell.js";
import { directions } from "./direction.js";
import type { Region } from "./region.js";

export type Coordinate = [x: number, y: number];
type RowConstraints = (number: number) => boolean;

export class Grid {
	private grid: Cell[][];

	constructor(
		private dimension: number,
		private regions: Region[] = [],
		private row_constraints: RowConstraints[] = [],
	) {
		this.grid = Array.from({ length: dimension }, (_, row) =>
			Array.from(
				{
					length: this.dimension,
				},
				(_, column) => new Cell(column, row, null),
			),
		);
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

	static from_values(
		/**
		 * Array of columns (rows outer array)
		 */
		cell_values: Value[][],
		regions: Region[] = [],
		row_constraints: RowConstraints[] = [],
	) {
		const dimension = cell_values.length;

		if (!cell_values.every((row) => row.length === dimension)) {
			throw new Error("Non-square");
		}

		const grid = new Grid(dimension, regions, row_constraints);

		grid.grid = cell_values.map((columns, row) =>
			columns.map((cell_value, column) => new Cell(column, row, cell_value)),
		);

		return grid;
	}

	private static validate_sequence(sequence: Cell[]) {
		if (sequence.length < 2) {
			throw new Error("Too short");
		}

		if (sequence[0].value === 0) {
			return false;
		}

		return true;
	}

	set(x: number, y: number, value: Value) {
		if (!this.is_valid_coordinate(x, y)) {
			throw new Error(`(${x},${y}) is not a valid coordinate.`);
		}

		this.grid[y][x].value = value;
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

	private get_shaded_cells(): Coordinate[] {
		const coordinates: Coordinate[] = [];

		for (let row = 0; row < this.dimension; row += 1) {
			for (let column = 0; column < this.dimension; column += 1) {
				if (this.grid[row][column].is_shaded) {
					coordinates.push([column, row]);
				}
			}
		}

		return coordinates;
	}

	private validate_region() {
		// Check that all cells in a (sub)region share the same value
		for (const region of this.current_regions) {
			let region_value = null;
			for (const [x, y] of region) {
				const cell = this.grid[y][x];

				if (cell.is_shaded || cell.value === null) {
					continue;
				}

				if (region_value === null) {
					region_value = cell.value;
				} else if (region_value !== cell.value) {
					return {
						isValid: false,
						reason: `Region has two or more values: ${String(
							region_value,
						)} ${String(cell.value)}`,
					};
				}
			}
		}

		// Check that adjacent cells in different regions do not share the same value

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
		for (const cell of row) {
			if (cell.is_shaded) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			if (cell.is_shaded === null) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			subsequence.push(cell);
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
						reason: `Broke rule in row ${row_index}: ${subsequence
							.map((cell) => `(${cell.column}, ${cell.row})`)
							.join(", ")}`,
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
				const shaded = this.grid[column][row].is_shaded;

				if (!shaded) {
					continue;
				}

				for (const [dx, dy] of directions) {
					const x = column + dx;
					const y = row + dy;

					if (!this.is_valid_coordinate(x, y)) {
						continue;
					}

					if (this.grid[x][y].is_shaded) {
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

function subsequence_to_number(sequence: Cell[]) {
	return Number.parseInt(sequence.map((cell) => cell.value).join(""));
}
