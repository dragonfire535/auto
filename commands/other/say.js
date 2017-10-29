const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'say',
			aliases: ['copy', 'echo'],
			group: 'other',
			memberName: 'say',
			description: 'Make Auto say what you wish.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like Auto to say?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(text);
	}
};
