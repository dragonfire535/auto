const Command = require('../../structures/Command');

module.exports = class HiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hi',
			aliases: ['hello', 'hey', 'hoi', 'hola'],
			group: 'other',
			memberName: 'hi',
			description: 'Hello.'
		});
	}

	async run(msg) {
		try {
			await msg.react('👋');
			return null;
		} catch (err) {
			return msg.reply('Hi there!');
		}
	}
};
