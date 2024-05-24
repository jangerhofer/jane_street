import { describe, expect, test } from "vitest";
import { Grid, Shaded } from "./grid.js";

describe("validation", () => {
	describe("shading", () => {
		test("basic failure -- horizontal", () => {
			const grid = Grid.from_cells([
				[Shaded, Shaded],
				[0, 0],
			]);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Adjacent `Shaded` cells",
			});
		});

		test("basic failure -- vertical", () => {
			const grid = Grid.from_cells([
				[Shaded, 7],
				[Shaded, 0],
			]);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Adjacent `Shaded` cells",
			});
		});

		test("basic success", () => {
			const grid = Grid.from_cells([
				[Shaded, 0],
				[0, 0],
			]);

			expect(grid.validate()).toEqual({
				isValid: true,
			});
		});
	});

	describe("row constraints", () => {
		test("basic failure", () => {
			const grid = Grid.from_cells(
				[
					[1, 0],
					[5, 1],
				],
				[],
				[
					(number: number) => number % 2 === 0,
					(number: number) => number % 4 === 0,
				],
			);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Broke rule in row 1: 5,1",
			});
		});

		test("basic success", () => {
			const grid = Grid.from_cells(
				[
					[1, 0],
					[6, 0],
				],
				[],
				[
					(number: number) => number % 2 === 0,
					(number: number) => number % 4 === 0,
				],
			);

			expect(grid.validate()).toEqual({
				isValid: true,
			});
		});
	});
});
