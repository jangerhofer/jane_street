import { example } from "./constraints/example.js";
import { Grid } from "./grid.js";
import { Region } from "./region.js";

async function hash(inputString: string) {
	// Encode the string into bytes
	const encoder = new TextEncoder();
	const data = encoder.encode(inputString);

	// Hash the string using SHA-256
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// Convert buffer to byte array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// Convert bytes to hexadecimal string
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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
		example.isPowerOf7,
		example.isFib,
		example.isMultipleOf5,
		example.isCube,
		example.isPalindrome,
	],
);

console.log(grid.solve());
