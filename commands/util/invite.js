const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { INVITE } = process.env;

module.exports = class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite', 'join'],
			category: 'util',
			description: {
				content: 'Responds with IA\'s invite links.'
			}
		});
	}

	exec(msg) {
		return msg.util.send(stripIndents`
			You cannot invite me to your server, but you can join my home server to use me:
			${INVITE || 'Coming soon...'}
		`);
	}
};
