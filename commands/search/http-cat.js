const Command = require('../../structures/Command');
const request = require('superagent');

module.exports = class HttpCatCommand extends Command {
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
			const { body } = await request.get(`https://http.cat/${code}.jpg`);
			return msg.say({ files: [{ attachment: body, name: `${code}.jpg` }] });
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
