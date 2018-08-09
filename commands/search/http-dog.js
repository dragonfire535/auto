const { Command } = require('discord-akairo');
const request = require('node-superfetch');

module.exports = class HttpDogCommand extends Command {
	constructor() {
		super('http-dog', {
			aliases: ['http-dog'],
			category: 'search',
			description: 'Responds with a dog for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'code',
					prompt: {
						start: 'What code do you want to get the dog of?',
						retry: 'You provided an invalid status code. Please try again.'
					},
					type: 'integer'
				}
			]
		});
	}

	async exec(msg, { code }) {
		try {
			const { body, headers } = await request.get(`https://httpstatusdogs.com/img/${code}.jpg`);
			if (headers['content-type'].includes('text/html')) return msg.util.send('Could not find any results.');
			return msg.util.send({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
