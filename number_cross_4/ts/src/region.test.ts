import { describe, expect, test } from "vitest";
import type { Coordinate } from "./grid.js";
import { Region } from "./region.js";

function build_coordinates_set(max_x: number, max_y: number) {
	const coordinates: Coordinate[] = [];

	for (let x = 0; x < max_x; x += 1) {
		for (let y = 0; y < max_y; y += 1) {
			coordinates.push([x, y]);
		}
	}

	return coordinates;
}

describe("`has_cell`", () => {
	test("basic", () => {
		const region = new Region([
			[0, 0],
			[0, 1],
			[0, 2],
			[2, 0],
		]);

		expect(region.has_cell(0, 0)).true;
		expect(region.has_cell(0, 1)).true;
		expect(region.has_cell(0, 2)).true;
		expect(region.has_cell(2, 0)).true;

		expect(region.has_cell(5, 0)).false;
		expect(region.has_cell(0, 5)).false;
	});
});

describe("dynamic regions", () => {
	test("basic -- vertical", () => {
		const region = new Region([
			[0, 0],
			[0, 1],
			[0, 2],
		]);

		expect(region.get_subregions([[0, 1]])).toEqual([[[0, 0]], [[0, 2]]]);
	});

	test("basic -- horizontal", () => {
		const region = new Region([
			[0, 0],
			[1, 0],
			[2, 0],
		]);

		expect(region.get_subregions([[1, 0]])).toEqual([[[0, 0]], [[2, 0]]]);
	});
});
