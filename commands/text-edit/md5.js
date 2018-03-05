const { Command } = require('discord.js-commando');
const crypto = require('crypto');

module.exports = class MD5Command extends Command {
	constructor(client) {
		super(client, {
			name: 'md5',
			aliases: ['md5-hash'],
			group: 'text-edit',
			memberName: 'md5',
			description: 'Creates a hash of text with the MD5 algorithm.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to create an MD5 hash of?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(crypto.createHash('md5').update(text).digest('hex'));
	}
};
