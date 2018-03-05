const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class HTTPCatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'http-cat',
			group: 'search',
			memberName: 'http-cat',
			description: 'Responds with a cat for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to get the cat of?',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			const { body, text } = await snekfetch.get(`https://http.cat/${code}.jpg`);
			if (text.startsWith('<!DOCTYPE html>')) return msg.say('Could not find any results.');
			return msg.say({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
