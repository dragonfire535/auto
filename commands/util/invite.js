const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['join'],
			group: 'util',
			memberName: 'invite',
			description: 'Responds with Auto\'s invite links.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			You cannot invite me to your server, but you can join my home server to use me:
			${this.client.options.invite || 'Coming soon...'}
		`);
	}
};
