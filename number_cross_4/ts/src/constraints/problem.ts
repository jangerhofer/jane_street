export const problem = {
	digits_7_sum(number) {
		const digits = number
			.toString(10)
			.split("")
			.map((char) => Number.parseInt(char, 10));

		return 7 === digits.reduce((sum, digit) => sum + digit, 0);
	},

	digits_product_ends_in_1(number) {
		const digits = number
			.toString(10)
			.split("")
			.map((char) => Number.parseInt(char, 10));

		const product = digits.reduce((accum, digit) => accum * digit, 1);

		return product.toString(10)[product.toString(10).length - 1] === "1";
	},

	is_fib(number) {
		function isPerfectSquare(x: number): boolean {
			const s = Math.sqrt(x);
			return s === Math.floor(s);
		}

		return (
			isPerfectSquare(5 * number * number + 4) ||
			isPerfectSquare(5 * number * number - 4)
		);
	},

	multiple_of_37: multiple_of(37),

	multiple_of_88: multiple_of(88),

	is_1_more_than_palindrome(number) {
		return is_palindrome(number - 1);
	},

	is_1_less_than_palindrome(number) {
		return is_palindrome(number + 1);
	},

	palindrome_and_multiple_of_23(number) {
		return is_palindrome(number) && multiple_of(23)(number);
	},

	prime_to_prime_power(number) {
		if (number <= 1) return false;

		for (let p = 2; p * p <= number; p++) {
			if (isPrime(p)) {
				let power = p;
				while (power <= number) {
					power *= p;
					if (power === number) return true;
				}
			}
		}
		return false;
	},

	square(number) {
		if (number < 0) {
			return false;
		}

		const square_root = Math.sqrt(number);

		return Math.round(square_root) ** 2 === number;
	},
} satisfies Record<string, (number: number) => boolean>;

function multiple_of(base: number) {
	return (number: number) => {
		if (number < 1) {
			return false;
		}

		return number % base === 0;
	};
}

function is_palindrome(number: number) {
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
}

function isPrime(num: number): boolean {
	if (num <= 1) return false;
	if (num <= 3) return true;
	if (num % 2 === 0 || num % 3 === 0) return false;

	for (let i = 5; i * i <= num; i += 6) {
		if (num % i === 0 || num % (i + 2) === 0) return false;
	}
	return true;
}

if (import.meta.vitest) {
	const { describe, expect, test } = import.meta.vitest;

	describe("digits sum to 7", () => {
		test("simple", () => {
			expect(problem.digits_7_sum(124)).toBe(true);
			expect(problem.digits_7_sum(214)).toBe(true);
			expect(problem.digits_7_sum(412)).toBe(true);
			expect(problem.digits_7_sum(421)).toBe(true);

			expect(problem.digits_7_sum(700)).toBe(true);
			expect(problem.digits_7_sum(601)).toBe(true);

			expect(problem.digits_7_sum(44)).toBe(false);
		});
	});

	describe("digits product ends in 1", () => {
		test("simple", () => {
			expect(problem.digits_product_ends_in_1(73)).toBe(true);
			expect(problem.digits_product_ends_in_1(37)).toBe(true);

			expect(problem.digits_product_ends_in_1(44)).toBe(false);
		});
	});

	describe("square", () => {
		test("simple", () => {
			expect(problem.square(1225)).toBe(true);
			expect(problem.square(1600)).toBe(true);

			expect(problem.square(1625)).toBe(false);
		});
	});

	describe("multiple", () => {
		test("simple", () => {
			expect(problem.multiple_of_88(440)).toBe(true);

			expect(problem.multiple_of_88(90)).toBe(false);
		});
	});

	describe("palindrome", () => {
		test("base", () => {
			expect(is_palindrome(404)).toBe(true);
			expect(is_palindrome(222)).toBe(true);
			expect(is_palindrome(1221)).toBe(true);

			expect(is_palindrome(405)).toBe(false);
			expect(is_palindrome(223)).toBe(false);
			expect(is_palindrome(1321)).toBe(false);
		});

		test("`is_1_less_than_palindrome`", () => {
			expect(problem.is_1_less_than_palindrome(403)).toBe(true);

			expect(problem.is_1_less_than_palindrome(404)).toBe(false);
		});

		test("`is_1_more_than_palindrome`", () => {
			expect(problem.is_1_more_than_palindrome(405)).toBe(true);

			expect(problem.is_1_more_than_palindrome(404)).toBe(false);
		});
	});

	describe("power to the power of a prime", () => {
		test("simple", () => {
			expect(problem.prime_to_prime_power(3 ** 3)).toBe(true);
			expect(problem.prime_to_prime_power(31 ** 3)).toBe(true);

			expect(problem.prime_to_prime_power(31 ** 3 - 1)).toBe(false);
		});
	});

	describe("fib", () => {
		test("true positives", () => {
			expect(problem.is_fib(1)).toBe(true);
			expect(problem.is_fib(2)).toBe(true);
			expect(problem.is_fib(144)).toBe(true);
			expect(problem.is_fib(4181)).toBe(true);
		});

		test("true negatives", () => {
			expect(problem.is_fib(4)).toBe(false);
			expect(problem.is_fib(6)).toBe(false);
			expect(problem.is_fib(18)).toBe(false);
			expect(problem.is_fib(121)).toBe(false);
		});
	});
}
