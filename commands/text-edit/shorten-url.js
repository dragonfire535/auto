const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class ShortenURLCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shorten-url',
			aliases: ['short-url', 'url-shorten'],
			group: 'text-edit',
			memberName: 'shorten-url',
			description: 'Creates a goo.gl short URL from another URL.',
			args: [
				{
					key: 'url',
					prompt: 'What url do you want to shorten?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { url }) {
		try {
			const { body } = await snekfetch
				.post('https://www.googleapis.com/urlshortener/v1/url')
				.query({ key: GOOGLE_KEY })
				.send({ longUrl: url });
			return msg.say(`<${body.id}>`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
