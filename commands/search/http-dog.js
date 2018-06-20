const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class HttpDogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'http-dog',
			group: 'search',
			memberName: 'http-dog',
			description: 'Responds with a dog for an HTTP status code.',
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to get the dog of?',
					type: 'integer'
				}
			]
		});
	}

	async run(msg, { code }) {
		try {
			const { body, headers } = await request.get(`https://httpstatusdogs.com/img/${code}.jpg`);
			if (headers['content-type'].includes('text/html')) return msg.say('Could not find any results.');
			return msg.say({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
