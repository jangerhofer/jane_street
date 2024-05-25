import { describe, expect, test } from "vitest";
import { Shaded } from "./cell.js";
import { example_row_constraints } from "./constraints.js";
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
