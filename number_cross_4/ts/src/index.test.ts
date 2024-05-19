import { describe, expect, test } from "vitest";
import { Grid, Shaded } from "./index.ts";

function stubRule() {
	return true;
}

describe("validation", () => {
	describe("shading placement", () => {
		test("correctly passes -- left/right", () => {
			const grid = Grid.from_contents([[Shaded, 3, 4, 3, Shaded]]);

			expect(grid.validate()).toEqual(true);
		});

		test("correctly passes -- up/down", () => {
			const grid = Grid.from_contents([
				[Shaded, 3, 4, 3, Shaded],
				[3, Shaded, 4, Shaded, 3],
			]);

			expect(grid.validate()).toEqual(true);
		});

		test("correctly fails -- left/right", () => {
			const grid = Grid.from_contents([[Shaded, Shaded, 4, 3, Shaded]]);

			expect(grid.validate()).toEqual(false);
		});

		test("correctly fails -- up/down", () => {
			const grid = Grid.from_contents([
				[9, Shaded, 4, 3, Shaded],
				[9, Shaded, 4, 3, Shaded],
			]);

			expect(grid.validate()).toEqual(false);
		});
	});
});
