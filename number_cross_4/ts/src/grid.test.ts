import { describe, expect, test } from "vitest";
import { Shaded } from "./cell.js";
import { Grid } from "./grid.js";
import { Region } from "./region.js";

describe("validation", () => {
	describe("shading", () => {
		test("basic failure -- horizontal", () => {
			const grid = Grid.from_values([
				[Shaded, Shaded],
				[0, 0],
			]);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Adjacent `Shaded` cells",
			});
		});

		test("basic failure -- vertical", () => {
			const grid = Grid.from_values([
				[Shaded, 7],
				[Shaded, 0],
			]);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Adjacent `Shaded` cells",
			});
		});

		test("basic success", () => {
			const grid = Grid.from_values([
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
			const grid = Grid.from_values(
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
				reason: "Broke rule in row 1: (0, 1), (1, 1)",
			});
		});

		test("basic success", () => {
			const grid = Grid.from_values(
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

	describe("regions", () => {
		test("non-matching values in region", () => {
			const grid = new Grid(3, [
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[2, 0],
					[2, 1],
					[2, 2],
				]),
			]);

			grid.set(0, 1, Shaded);

			grid.set(2, 1, 7);
			grid.set(2, 2, 5);

			expect(grid.validate()).toEqual({
				isValid: false,
				reason: "Region has two or more values: 7 5",
			});
		});

		test("only matching & null values in region", () => {
			const grid = new Grid(3, [
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[2, 0],
					[2, 1],
					[2, 2],
				]),
			]);

			grid.set(0, 1, Shaded);

			grid.set(2, 1, 7);
			grid.set(2, 2, 7);

			expect(grid.validate()).toEqual({
				isValid: true,
			});
		});

		test("only adjacent cells with same value in separate regions", () => {
			const grid = new Grid(3, [
				new Region([
					[0, 0],
					[0, 1],
					[0, 2],
				]),
				new Region([
					[1, 0],
					[1, 1],
					[1, 2],
					[2, 0],
					[2, 1],
					[2, 2],
				]),
			]);

			grid.set(0, 0, 5);
			grid.set(1, 0, 5);
			grid.set(2, 0, 5);

			console.log(grid.toString());

			expect(grid.validate()).toEqual({
				isValid: false,
			});
		});
	});
});
