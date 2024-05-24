export const Shaded = Symbol("Shaded");
type Value = null | number | typeof Shaded;

const separator = "__";

export class Cell {
	constructor(
		private x: number,
		private y: number,
		private value: Value = null,
	) {}

	static from_key(key: string) {
		const [x, y] = key.split(separator).map((s) => Number.parseInt(s, 10));

		return new Cell(x, y);
	}

	get key() {
		return [this.x, this.y].join(separator);
	}
}
