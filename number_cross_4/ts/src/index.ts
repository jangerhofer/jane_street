import { Grid } from "./grid.js";
import { Region } from "./region.js";

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
	[],
);

console.log(grid.validate());
