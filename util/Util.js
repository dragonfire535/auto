class Util {
	static pad(str, len = 2) {
		str = `${str}`;
		return str.length >= len ? str : `${'0'.repeat(len - str.length)}${str}`;
	}

	static duration(ms) {
		const sec = Math.floor((ms / 1000) % 60);
		const min = Math.floor((ms / (1000 * 60)) % 60);
		const hrs = Math.floor(ms / (1000 * 60 * 60));
		return {
			hours: hrs,
			minutes: min,
			seconds: sec,
			format: () => `${this.pad(hrs)}:${this.pad(min)}:${this.pad(sec)}`
		};
	}

	static trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}
}

module.exports = Util;
