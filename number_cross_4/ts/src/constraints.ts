import type { Sequence } from "./index.js";

export const clue_constraints = {
	isCube(sequence: number[]) {
		if (!isValidSequence(sequence)) {
			return false;
		}

		const number = sequenceToNumber(sequence);

		return number ** (1 / 3) % 1 === 0;
	},
	isFib(sequence: Sequence) {
		if (!isValidSequence(sequence)) {
			return false;
		}

		for (const num of sequence) {
			if (![0, 1, 2, 3, 5, 8].includes(num)) {
				return false;
			}
		}

		return true;
	},
	isMultipleOf5(sequence: number[]) {
		if (!isValidSequence(sequence)) {
			return false;
		}

		const number = sequenceToNumber(sequence);

		if (number < 1) {
			return false;
		}

		return number % 5 === 0;
	},
	isPalindrome(sequence: Sequence) {
		if (!isValidSequence(sequence)) {
			return false;
		}

		let l = 0;
		let r = sequence.length - 1;

		while (l <= r) {
			if (sequence[l] !== sequence[r]) {
				return false;
			}

			l++;
			r--;
		}

		return true;
	},
	isPowerOf7(sequence: number[]) {
		if (!isValidSequence(sequence)) {
			return false;
		}

		const number = sequenceToNumber(sequence);

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
};

const log = (base: number) => (value: number) =>
	Math.log(value) / Math.log(base);
const logBase7 = log(7);

function sequenceToNumber(sequence: Sequence) {
	return Number.parseInt(sequence.join(""));
}

function isValidSequence(sequence: number[]): boolean {
	if (sequence.length < 2) {
		throw new Error("Too short");
	}

	if (sequence[0] === 0) {
		return false;
	}

	return true;
}

if (import.meta.vitest) {
	const { describe, expect, test } = import.meta.vitest;

	describe("palindrome", () => {
		test("true positives", () => {
			// Odd length
			expect(clue_constraints.isPalindrome([1, 0, 1])).toBe(true);
			expect(clue_constraints.isPalindrome([1, 9, 1])).toBe(true);
			expect(clue_constraints.isPalindrome([2, 0, 2])).toBe(true);

			//     Even length
			expect(clue_constraints.isPalindrome([2, 0, 0, 2])).toBe(true);
			expect(clue_constraints.isPalindrome([2, 0, 0, 2])).toBe(true);
		});

		test("true negatives", () => {
			// Odd length
			expect(clue_constraints.isPalindrome([1, 0, 2])).toBe(false);
			expect(clue_constraints.isPalindrome([2, 0, 3])).toBe(false);

			//     Even length
			expect(clue_constraints.isPalindrome([2, 0, 0, 4])).toBe(false);
			expect(clue_constraints.isPalindrome([2, 0, 0, 8])).toBe(false);
		});
	});

	describe("power of seven", () => {
		test("true positives", () => {
			expect(clue_constraints.isPowerOf7([4, 9])).toBe(true);
			expect(clue_constraints.isPowerOf7([3, 4, 3])).toBe(true);
			expect(clue_constraints.isPowerOf7([2, 8, 2, 4, 7, 5, 2, 4, 9])).toBe(
				true,
			);
		});

		test("true negatives", () => {
			expect(() => clue_constraints.isPowerOf7([6])).toThrowError();
			expect(clue_constraints.isPowerOf7([5, 0])).toBe(false);
		});
	});
}
