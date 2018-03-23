const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class DonateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'donate',
			aliases: ['patreon', 'paypal'],
			group: 'util',
			memberName: 'donate',
			description: 'Responds with Auto\'s donation links.',
			guarded: true
		});
	}

	run(msg) {
		return msg.say(stripIndents`
			Contribute to Auto development!
			<https://www.patreon.com/littlelimedragon>
			<https://paypal.me/dragonfire535>
		`);
	}
};
