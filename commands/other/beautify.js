const { Command } = require('discord.js-commando');
const { js_beautify: beautify } = require('js-beautify');

module.exports = class BeautifyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beautify',
			group: 'other',
			memberName: 'beautify',
			description: 'Beautifies code with js-beautify.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to beautify?',
					type: 'code'
				}
			]
		});
	}

	run(msg, { code }) {
		if (!code) return msg.reply('Invalid message!');
		return msg.code(code.lang || 'js', beautify(code.code));
	}
};
