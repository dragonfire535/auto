const { ArgumentType } = require('discord.js-commando');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;

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
			return {
				code: parsed[2],
				lang: parsed[1]
			};
		}
		return null;
	}
}

module.exports = CodeArgumentType;
