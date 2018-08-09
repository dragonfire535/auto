const Type = require('../structures/Type');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

module.exports = class CodeType extends Type {
	async exec(phrase, msg) {
		if (!phrase) return null;
		if (/^[0-9]+$/.test(phrase)) {
			try {
				const message = await msg.channel.messages.fetch(phrase);
				phrase = message.content;
			} catch (err) {
				return { code: phrase, lang: null };
			}
		}
		if (codeblock.test(phrase)) {
			const parsed = codeblock.exec(phrase);
			return {
				code: parsed[2],
				lang: parsed[1] ? parsed[1].toLowerCase() : null
			};
		}
		return { code: phrase, lang: null };
	}
};
