const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class HastebinCommand extends Command {
	constructor() {
		super('hastebin', {
			aliases: ['hastebin', 'pastebin'],
			category: 'other',
			description: 'Posts code to hastebin.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					id: 'code',
					prompt: {
						start: 'What code do you want to post to hastebin?',
						retry: 'You provided invalid code. Please try again.'
					},
					match: 'content',
					type: 'code'
				}
			]
		});
	}

	async exec(msg, { code }) {
		try {
			const { body } = await request
				.post('https://hastebin.com/documents')
				.send(code.code);
			return msg.util.reply(`https://hastebin.com/${body.key}.${code.lang || 'js'}`);
		} catch (err) {
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
