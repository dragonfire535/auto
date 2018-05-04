const { Command } = require('discord.js-commando');
const { list, base64 } = require('../../util/Util');
const modes = ['encode', 'decode'];

module.exports = class Base64Command extends Command {
	constructor(client) {
		super(client, {
			name: 'base64',
			aliases: ['base-64'],
			group: 'text-edit',
			memberName: 'base64',
			description: 'Converts text to/from Base64.',
			details: `**Modes**: ${modes.join(', ')}`,
			args: [
				{
					key: 'mode',
					prompt: `Would you like to ${list(modes, 'or')}?`,
					type: 'string',
					oneOf: modes,
					parse: mode => mode.toLowerCase()
				},
				{
					key: 'text',
					prompt: 'What text would you like to convert to Base64?',
					type: 'string',
					validate: text => {
						if (base64(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { mode, text }) {
		const converted = base64(text, mode);
		if (!converted) return msg.reply('That is not valid Base64.');
		return msg.say(converted);
	}
};
