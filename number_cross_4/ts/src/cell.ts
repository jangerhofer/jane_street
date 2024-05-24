export const Shaded = Symbol("Shaded");
export type Value = null | number | typeof Shaded;

const separator = "__";

export class Cell {
	constructor(
		public column: number,
		public row: number,
		public value: Value = null,
	) {}

	static from_key(key: string) {
		const [x, y] = key.split(separator).map((s) => Number.parseInt(s, 10));

		return new Cell(x, y);
	}

	get key() {
		return [this.row, this.column].join(separator);
	}

	get is_shaded() {
		return this.value === Shaded;
	}

	get coordinate_string(): string {
		return `(${this.column}, ${this.row})`;
	}
}
