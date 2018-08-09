const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class HttpCatCommand extends Command {
	constructor() {
		super('http-cat', {
			aliases: ['http-cat'],
			category: 'search',
			description: 'Responds with a cat for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'code',
					prompt: {
						start: 'What code do you want to get the cat of?',
						retry: 'You provided an invalid status code. Please try again.'
					},
					type: 'integer'
				}
			]
		});
	}

	async exec(msg, { code }) {
		try {
			const { body, headers } = await request.get(`https://http.cat/${code}.jpg`);
			if (headers['content-type'] === 'text/html') return msg.util.send('Could not find any results.');
			return msg.util.send({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			if (err.status === 404) return msg.util.send('Could not find any results.');
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
