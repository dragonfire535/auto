const { Command } = require('discord-akairo');

module.exports = class HiCommand extends Command {
	constructor() {
		super('hi', {
			aliases: ['hi', 'hello', 'hey', 'hoi', 'hola'],
			category: 'other',
			description: {
				content: 'Hello.'
			}
		});
	}

	async exec(msg) {
		try {
			await msg.react('👋');
			return null;
		} catch (err) {
			return msg.util.reply('Hi there!');
		}
	}
};
