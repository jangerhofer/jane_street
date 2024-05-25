import { Cell, Shaded, type Value } from "./cell.js";
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

	toString(): string {
		return [this.valuesToString(), this.regionsToString()].join("\n\n");
	}

	regionsToString(): string {
		const currentRegions = this.current_regions;
		const regionMap = new Map<string, string>();
		const conflictMap = new Map<string, number>();

		currentRegions.forEach((region, index) => {
			for (const [x, y] of region) {
				const key = new Cell(x, y, null).key;
				if (regionMap.has(key)) {
					regionMap.set(key, "*");
					conflictMap.set(key, (conflictMap.get(key) || 1) + 1);
				} else {
					regionMap.set(key, String(index));
				}
			}
		});

		return Array.from({ length: this.dimension }, (_, y) =>
			Array.from({ length: this.dimension }, (_, x) => {
				const key = new Cell(x, y, null).key;
				return regionMap.get(key) || ".";
			}).join(" "),
		).join("\n");
	}

	valuesToString(): string {
		return this.grid
			.map((row) =>
				row
					.map((cell) =>
						cell.value !== null
							? cell.is_shaded
								? "X"
								: String(cell.value)
							: ".",
					)
					.join(" "),
			)
			.join("\n");
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
		for (let y = 0; y < this.dimension; y += 1) {
			for (let x = 0; x < this.dimension; x += 1) {
				const cell = this.grid[y][x];
				const cell_region = this.current_regions.findIndex((region) =>
					region.some(([x, y]) => x === cell.column && y === cell.row),
				);

				if (cell_region === -1) {
					console.warn(`Cell not in any region: ${cell.coordinate_string}`);

					continue;
				}

				// We check for contiguous Shaded cells elsewhere
				if (cell.value === Shaded) {
					continue;
				}

				if (cell.value === null) {
					continue;
				}

				for (const [dx, dy] of directions) {
					const nx = x + dx;
					const ny = y + dy;

					if (!this.is_valid_coordinate(nx, ny)) {
						continue;
					}

					const adjacent_cell = this.grid[ny][nx];
					const adjacent_cell_region = this.current_regions.findIndex(
						(region) =>
							region.some(
								([x, y]) =>
									x === adjacent_cell.column && y === adjacent_cell.row,
							),
					);

					if (adjacent_cell_region === -1) {
						console.warn(
							`Cell not in any region: ${adjacent_cell.coordinate_string}`,
						);

						continue;
					}

					// We check for contiguous Shaded cells elsewhere
					if (adjacent_cell.value === Shaded) {
						continue;
					}

					if (adjacent_cell.value === null) {
						continue;
					}

					const different_regions = cell_region !== adjacent_cell_region;
					const same_value = cell.value === adjacent_cell.value;

					if (different_regions) {
						if (same_value) {
							return {
								isValid: false,
								reason: `Adjacent cells in different regions share the same value: ${cell.coordinate_string} ${adjacent_cell.coordinate_string}`,
							};
						}
					} else {
						if (!same_value) {
							throw new Error(
								`Different values in same region leaked: ${String(
									cell.value,
								)} !== ${String(adjacent_cell.value)}`,
							);
						}
					}
				}
			}
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
		for (const cell of row) {
			if (cell.is_shaded) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			if (cell.value === null) {
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
		for (const row of this.grid) {
			for (const cell of row) {
				if (!cell.is_shaded) {
					continue;
				}

				for (const [dx, dy] of directions) {
					const x = cell.column + dx;
					const y = cell.row + dy;

					if (!this.is_valid_coordinate(x, y)) {
						continue;
					}

					if (this.grid[y][x].is_shaded) {
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

function subsequence_to_number(sequence: Cell[]) {
	return Number.parseInt(sequence.map((cell) => cell.value).join(""));
}
