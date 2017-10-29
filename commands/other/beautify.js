const { Command } = require('discord.js-commando');
const { js_beautify: beautify } = require('js-beautify');
const codeblock = /```(.|\s)+```/gi;

module.exports = class BeautifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautify',
			group: 'other',
			memberName: 'beautify',
			description: 'Beautifies code with js-beautify.',
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to beautify?',
					type: 'string',
					parse: code => {
						if (!codeblock.test(code)) return null;
						return code.match(codeblock)[0].replace(/```(js|javascript)?|```/gi, '').trim();
					}
				}
			]
		});
	}

	run(msg, { code }) {
		if (!code) return msg.reply('Invalid message!');
		return msg.code('js', beautify(code, { indent_with_tabs: true }));
	}
};
