export class ExAdsCypher {
	private _msg: string

	constructor(msg: string) {
		this._msg = msg
	}

	private calcSquareSize() {
		return Math.ceil(Math.sqrt(this.normalizeRawMsg().length))
	}

	private normalizeRawMsg() {
		const normalized = this._msg.toLowerCase().replace(/[^\w]/g, '')
		if (normalized.length > 64) throw new Error(`NORMALIZED_MSG_TOO_LONG`)
		return normalized
	}

	private slicedRawMsg() {
		return this.sliceString(this.normalizeRawMsg(), this.calcSquareSize())
	}

	private encodeMsg() {
		const square = this
			.slicedRawMsg()
			.map((row_string: string) => row_string.split(''))

		return Array.prototype.concat.apply([], this.transposeArray(square)).join('')
	}

	private sliceString(string: string, size: number) {
		return string.match(new RegExp(`.{1,${size}}`, 'g')) || []
	}

	private transposeArray(array: string[][]) {
		return array[0].map((_, column_index) =>
			array.map(row => row[column_index] || ` `)
		)
	}

	public encode() {
		return this.sliceString(this.encodeMsg(), this.calcSquareSize()).join(' ')
	}
}