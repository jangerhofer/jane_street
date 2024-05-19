import { describe, expect, test } from "vitest";
import { Grid, Shaded } from "./index.ts";

function stubRule() {
	return true;
}

describe("valiation", () => {
	describe("shading placement", () => {
		test("correctly passes", () => {
			const grid = Grid.from_contents(
				[[Shaded, 3, 4, 3, Shaded]],
				[],
				[stubRule, stubRule, stubRule, stubRule, stubRule],
			);

			expect(grid.validate()).toEqual(true);
		});

		test("correctly fails -- right/left", () => {
			const grid = Grid.from_contents([[Shaded, Shaded, 4, 3, Shaded]]);

			expect(grid.validate()).toEqual(false);
		});
	});
});
