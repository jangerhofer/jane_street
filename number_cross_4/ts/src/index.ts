import { Region } from "./region.js";

export type Coordinate = [x: number, y: number];
export type Sequence = number[];

type RowHintFunc = (sequence: Sequence) => boolean;

export const Shaded = Symbol("Shading");
type Cell = null | number | typeof Shaded;

export class Grid {
	private coords: Cell[][];
	private regions: Region[] = [];
	private rows: RowHintFunc[];

	constructor(dimension: number, regions: Coordinate[][], rows: RowHintFunc[]) {
		if (rows.length !== dimension) {
			console.warn(`${dimension} !== rows ${rows.length}.`);
		}

		this.coords = Array.from({ length: dimension }, () =>
			new Array(dimension).fill(null),
		);

		for (const region of regions) {
			this.regions.push(new Region(region, dimension));
		}

		this.rows = rows;
	}

	static from_contents(
		contents: (number | typeof Shaded)[][],
		regions: Coordinate[][] = [],
		rows: RowHintFunc[] = [],
	) {
		const grid = new Grid(contents.length, regions, rows);

		grid.coords = contents;

		return grid;
	}

	validate() {
		return this.validate_shading_placement();
	}

	get(x: number, y: number) {
		return this.coords[x][y];
	}

	set(x: number, y: number, value: Cell) {
		this.coords[x][y] = value;
	}

	row_is_valid(index: number) {
		const entire_row = this.build_row(index);

		const subsequences = this.build_subsequences(entire_row);

		console.log(subsequences);

		const rule = this.rows[index];
		return subsequences.every((subsequence) => rule(subsequence));
	}

	private validate_shading_placement() {
		for (let column = 0; column < this.coords.length; column++) {
			for (let row = 0; row < this.coords[column].length; row++) {
				const shaded = this.coords[column][row] === Shaded;

				if (!shaded) {
					continue;
				}

				console.log({ column, row });

				// 	Left
				if (column > 0) {
					if (this.coords[column - 1][row] === Shaded) {
						return false;
					}
				}
				// 	Up
				if (row > 0) {
					if (this.coords[column][row - 1] === Shaded) {
						return false;
					}
				}
				// 	Right
				if (column < this.coords.length - 1) {
					if (this.coords[column + 1][row] === Shaded) {
						return false;
					}
				}
				// 	Down
				if (row < this.coords.length - 1) {
					if (this.coords[column][row + 1] === Shaded) {
						return false;
					}
				}
			}
		}

		return true;
	}

	private build_row(index: number) {
		return this.coords[index];
	}

	private build_subsequences(sequence: Cell[]) {
		const subsequences = [];
		let subsequence = [];

		for (const element of sequence) {
			if (element === Shaded) {
				if (subsequence.length > 0) {
					subsequences.push(subsequence);
					subsequence = [];
				}

				continue;
			}

			if (element === null) {
				console.warn("FOUND NULL");

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
}

//
// const grid = new Grid(5, [[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], [[1, 0],
// [1, 1], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4]], [[2, 0], [2, 1], [2, 2],
// [3, 0], [3, 2], [3, 3], [3, 4], [4, 4]], [[3, 1], [4, 0], [4, 1], [4, 2],
// [4, 3]]], [clue_constraints.isPowerOf7, clue_constraints.isFib,
// clue_constraints.isMultipleOf5, clue_constraints.isCube,
// clue_constraints.isPalindrome,]);  grid.set(0, 0, Shaded); grid.set(0, 1,
// 3); grid.set(0, 2, 4); grid.set(0, 3, 3); grid.set(0, 4, Shaded);
