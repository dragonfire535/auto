const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['pong', 'ping-pong'],
			group: 'util',
			memberName: 'ping',
			description: 'Checks the bot\'s ping to the Discord server.',
			guarded: true
		});
	}

	async run(msg) {
		const message = await msg.say('Pinging...');
		return message.edit(stripIndents`
			🏓 Pong! \`${Math.round(message.createdTimestamp - msg.createdTimestamp)}ms\`
			Heartbeat: \`${Math.round(this.client.ping)}ms\`
		`);
	}
};
