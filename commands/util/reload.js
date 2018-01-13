const { Command } = require('discord.js-commando');

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			group: 'util',
			memberName: 'reload',
			description: 'Reloads a command.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to reload?',
					type: 'command'
				}
			]
		});
	}

	run(msg, { command }) {
		command.reload();
		return msg.say(`Reloaded \`${command.name}\`.`);
	}
};
