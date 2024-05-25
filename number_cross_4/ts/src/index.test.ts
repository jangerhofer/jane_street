import { describe, expect, test } from "vitest";
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
});
