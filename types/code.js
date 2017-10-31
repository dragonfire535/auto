const { ArgumentType } = require('discord.js-commando');
const codeblock = /(`{3})(js|javascript)?\n([\s\S]*)\1/gi;

class CodeArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'code');
	}

	validate(value) {
		return Boolean(value);
	}

	async parse(value, msg) {
		if (/^[0-9]+$/.test(value)) {
			try {
				const message = await msg.channel.messages.fetch(value);
				value = message.content;
			} catch (err) {
				return null;
			}
		}
		if (codeblock.test(value)) {
			const parsed = codeblock.exec(value);
			console.log(parsed);
			return {
				code: parsed[3].trim(),
				lang: parsed[2]
			};
		}
		return null;
	}
}

module.exports = CodeArgumentType;
