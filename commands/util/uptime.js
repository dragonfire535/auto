const { Command } = require('discord.js-commando');
const { duration } = require('../../util/Util');

module.exports = class UptimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'uptime',
			group: 'util',
			memberName: 'uptime',
			description: 'Responds with how long the bot has been active.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(duration(this.client.uptime));
	}
};
