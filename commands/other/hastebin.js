const Command = require('../../structures/Command');
const request = require('superagent');

module.exports = class HastebinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hastebin',
			aliases: ['pastebin'],
			group: 'other',
			memberName: 'hastebin',
			description: 'Posts code to hastebin.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to post to hastebin?',
					type: 'code'
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			const { body } = await request
				.post('https://hastebin.com/documents')
				.send(code.code);
			return msg.reply(`https://hastebin.com/${body.key}.${code.lang || 'js'}`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
