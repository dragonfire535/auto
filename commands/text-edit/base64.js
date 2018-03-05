const { Command } = require('discord.js-commando');

module.exports = class Base64Command extends Command {
	constructor(client) {
		super(client, {
			name: 'base64',
			aliases: ['base-64'],
			group: 'text-edit',
			memberName: 'base64',
			description: 'Converts text to Base64.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to convert to Base64?',
					type: 'string',
					validate: text => {
						if (Buffer.from(text).toString('base64').length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(Buffer.from(text).toString('base64'));
	}
};
