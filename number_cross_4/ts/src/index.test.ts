import { describe, expect, test } from "vitest";
import { Shaded } from "./cell.js";
import { example_row_constraints } from "./constraints/example.js";
import { Grid } from "./grid.js";
import { Region } from "./region.js";

describe("problem example", () => {
	test("it validates", () => {
		const grid = new Grid(
			5,
			[
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3],
					[0, 4],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 3],
					[2, 4],
				]),
				new Region([
					[2, 0],
					[2, 1],
					[2, 2],

					[3, 2],
					[3, 3],
					[3, 4],
					[4, 4],
				]),
				new Region([[3, 0]]),
				new Region([
					[3, 1],
					[4, 0],
					[4, 1],
					[4, 2],
					[4, 3],
				]),
			],
			[
				example_row_constraints.isPowerOf7,
				example_row_constraints.isFib,
				example_row_constraints.isMultipleOf5,
				example_row_constraints.isCube,
				example_row_constraints.isPalindrome,
			],
		);

		expect(grid.validate()).toEqual({ isValid: true });
	});

	test("it validates & identifies solution", () => {
		const grid = new Grid(
			5,
			[
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3],
					[0, 4],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 3],
					[2, 4],
				]),
				new Region([
					[2, 0],
					[2, 1],
					[2, 2],

					[3, 2],
					[3, 3],
					[3, 4],
					[4, 4],
				]),
				new Region([[3, 0]]),
				new Region([
					[3, 1],
					[4, 0],
					[4, 1],
					[4, 2],
					[4, 3],
				]),
			],
			[
				example_row_constraints.isPowerOf7,
				example_row_constraints.isFib,
				example_row_constraints.isMultipleOf5,
				example_row_constraints.isCube,
				example_row_constraints.isPalindrome,
			],
		);

		expect(grid.is_solution()).toEqual(false);

		const solution = [
			[Shaded, 3, 4, 3, Shaded],
			[1, 3, Shaded, 5, 5],
			[1, 3, 7, 7, 5],
			[Shaded, 3, 3, 7, 5],
			[7, 3, 3, 7, Shaded],
		];

		for (const [row_index, row] of solution.entries()) {
			for (const [column_index, cell] of row.entries()) {
				// @ts-ignore
				grid.set(column_index, row_index, cell);
			}
		}

		expect(grid.validate()).toEqual({ isValid: true });
		expect(grid.is_solution()).toEqual(true);
	});

	test("sums correct solution", () => {
		const grid = new Grid(
			5,
			[
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3],
					[0, 4],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 3],
					[2, 4],
				]),
				new Region([
					[2, 0],
					[2, 1],
					[2, 2],

					[3, 2],
					[3, 3],
					[3, 4],
					[4, 4],
				]),
				new Region([[3, 0]]),
				new Region([
					[3, 1],
					[4, 0],
					[4, 1],
					[4, 2],
					[4, 3],
				]),
			],
			[
				example_row_constraints.isPowerOf7,
				example_row_constraints.isFib,
				example_row_constraints.isMultipleOf5,
				example_row_constraints.isCube,
				example_row_constraints.isPalindrome,
			],
		);

		expect(grid.is_solution()).toEqual(false);

		const solution = [
			[Shaded, 3, 4, 3, Shaded],
			[1, 3, Shaded, 5, 5],
			[1, 3, 7, 7, 5],
			[Shaded, 3, 3, 7, 5],
			[7, 3, 3, 7, Shaded],
		];

		for (const [row_index, row] of solution.entries()) {
			for (const [column_index, cell] of row.entries()) {
				// @ts-ignore
				grid.set(column_index, row_index, cell);
			}
		}

		expect(grid.validate()).toEqual({ isValid: true });
		expect(grid.is_solution()).toEqual(true);

		expect(grid.sum_solution()).toEqual(24898);
	});

	test("solves correctly", () => {
		const grid = new Grid(
			5,
			[
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3],
					[0, 4],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 3],
					[2, 4],
				]),
				new Region([
					[2, 0],
					[2, 1],
					[2, 2],

					[3, 2],
					[3, 3],
					[3, 4],
					[4, 4],
				]),
				new Region([[3, 0]]),
				new Region([
					[3, 1],
					[4, 0],
					[4, 1],
					[4, 2],
					[4, 3],
				]),
			],
			[
				example_row_constraints.isPowerOf7,
				example_row_constraints.isFib,
				example_row_constraints.isMultipleOf5,
				example_row_constraints.isCube,
				example_row_constraints.isPalindrome,
			],
		);

		expect(grid.is_solution()).toEqual(false);

		expect(grid.solve()).toBe(true);

		expect(grid.validate()).toEqual({ isValid: true });
		expect(grid.is_solution()).toEqual(true);

		expect(grid.sum_solution()).toEqual(24898);
	});
});

describe("problem ", () => {
	test("solves correctly", () => {
		const grid = new Grid(
			11,
			[
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
					[0, 3],
					[0, 4],
					[0, 5],
					[0, 1],
					[0, 2],
				]),

				new Region([
					[0, 6],
					[0, 7],
					[0, 8],
					[0, 9],
					[0, 10],
					[1, 7],
					[1, 8],
					[1, 10],
					[2, 10],
					[3, 9],
					[3, 10],
					[4, 9],
					[4, 10],
					[5, 9],
				]),

				new Region([
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 1],
					[2, 2],
					[2, 3],
					[3, 1],
				]),

				new Region([
					[1, 5],
					[1, 6],
					[2, 5],
					[2, 6],
					[3, 5],
					[3, 6],
					[3, 7],
					[4, 4],
					[4, 5],
					[4, 6],
					[5, 4],
					[5, 5],
					[6, 5],
					[7, 1],
					[7, 2],
					[7, 3],
					[7, 4],
					[7, 5],
					[7, 6],
					[7, 7],
					[7, 8],
					[7, 9],
					[8, 0],
					[8, 1],
					[8, 2],
					[8, 7],
					[8, 8],
					[8, 9],
					[8, 10],
					[9, 0],
					[9, 1],
					[9, 2],
					[9, 8],
					[9, 9],
					[9, 10],
					[10, 0],
					[10, 7],
					[10, 8],
				]),

				new Region([
					[1, 9],
					[2, 7],
					[2, 8],
					[2, 9],
					[3, 8],
					[4, 7],
					[4, 8],
				]),

				new Region([
					[2, 4],
					[3, 0],
					[3, 2],
					[3, 3],
					[3, 4],
					[4, 0],
					[4, 1],
					[4, 2],
					[4, 3],
					[5, 0],
					[5, 1],
					[5, 2],
				]),

				new Region([
					[5, 3],
					[6, 3],
					[6, 4],
				]),

				new Region([
					[5, 6],
					[5, 7],
					[5, 8],
					[5, 10],
					[6, 6],
					[6, 7],
					[6, 8],
					[6, 9],
					[6, 10],
					[7, 10],
				]),

				new Region([
					[6, 0],
					[6, 1],
					[6, 2],
					[7, 0],
				]),

				new Region([
					[8, 3],
					[8, 4],
					[9, 3],
					[10, 1],
					[10, 2],
					[10, 3],
					[10, 4],
				]),

				new Region([
					[8, 5],
					[8, 6],
					[9, 4],
					[9, 5],
					[9, 6],
					[9, 7],
					[10, 6],
				]),

				new Region([[10, 5]]),

				new Region([
					[10, 9],
					[10, 10],
				]),
			],
			[],
		);

		expect(grid.is_solution()).toEqual(false);

		// expect(grid.solve()).toBe(true);
		// grid.solve();

		console.log(grid.toString());
		// expect(grid.validate()).toEqual({ isValid: true });
		// expect(grid.is_solution()).toEqual(true);
		//
		// expect(grid.sum_solution()).toEqual(24898);
	});
});
