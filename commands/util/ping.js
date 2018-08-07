const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping', 'pong', 'ping-pong'],
			category: 'util',
			description: {
				content: 'Checks the bot\'s ping to the Discord server.'
			}
		});
	}

	async exec(msg) {
		const message = await msg.util.send('Pinging...');
		const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
		return message.edit(stripIndents`
			🏓 P${'o'.repeat(Math.ceil(Math.min(ping / 100, 1800)))}ng! \`${ping}ms\`
			Heartbeat: \`${Math.round(this.client.ping)}ms\`
		`);
	}
};
