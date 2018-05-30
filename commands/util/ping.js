const Command = require('../../structures/Command');
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
		const ping = Math.round(message.createdTimestamp - msg.createdTimestamp);
		return message.edit(stripIndents`
			🏓 P${'o'.repeat(Math.ceil(ping / 100))}ng! \`${ping}ms\`
			Heartbeat: \`${Math.round(this.client.ping)}ms\`
		`);
	}
};
