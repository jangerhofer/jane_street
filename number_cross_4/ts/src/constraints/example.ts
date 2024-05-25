export const example_row_constraints = {
	isCube(number) {
		if (number < 0) return false;

		const cubeRoot = Math.cbrt(number);
		return Math.round(cubeRoot) ** 3 === number;
	},

	isFib(number) {
		function isPerfectSquare(x: number): boolean {
			const s = Math.sqrt(x);
			return s === Math.floor(s);
		}

		return (
			isPerfectSquare(5 * number * number + 4) ||
			isPerfectSquare(5 * number * number - 4)
		);
	},

	isMultipleOf5(number) {
		if (number < 1) {
			return false;
		}

		return number % 5 === 0;
	},

	isPalindrome(number) {
		const chars = number.toString(10);

		let l = 0;
		let r = chars.length - 1;

		while (l <= r) {
			if (chars[l] !== chars[r]) {
				return false;
			}

			l++;
			r--;
		}

		return true;
	},

	isPowerOf7(number) {
		if (number < 1) {
			return false;
		}

		let val = number;
		while (val > 1) {
			if (val % 7 !== 0) {
				return false;
			}

			val /= 7;
		}

		return true;
	},
} satisfies Record<string, (number: number) => boolean>;

if (import.meta.vitest) {
	const { describe, expect, test } = import.meta.vitest;

	describe("palindrome", () => {
		test("true positives", () => {
			// Odd length
			expect(example_row_constraints.isPalindrome(101)).toBe(true);
			expect(example_row_constraints.isPalindrome(191)).toBe(true);
			expect(example_row_constraints.isPalindrome(202)).toBe(true);

			//     Even length
			expect(example_row_constraints.isPalindrome(2002)).toBe(true);
		});

		test("true negatives", () => {
			// Odd length
			expect(example_row_constraints.isPalindrome(102)).toBe(false);
			expect(example_row_constraints.isPalindrome(203)).toBe(false);

			//     Even length
			expect(example_row_constraints.isPalindrome(2004)).toBe(false);
			expect(example_row_constraints.isPalindrome(2008)).toBe(false);
		});
	});

	describe("power of seven", () => {
		test("true positives", () => {
			expect(example_row_constraints.isPowerOf7(49)).toBe(true);
			expect(example_row_constraints.isPowerOf7(343)).toBe(true);
			expect(example_row_constraints.isPowerOf7(282475249)).toBe(true);
		});

		test("true negatives", () => {
			// expect(() => example_row_constraints.isPowerOf7(6)).toThrowError();
			expect(example_row_constraints.isPowerOf7(50)).toBe(false);
		});
	});
}