const { Command } = require('discord-akairo');
const { js_beautify: beautify } = require('js-beautify');
const { stripIndents } = require('common-tags');

module.exports = class BeautifyCommand extends Command {
	constructor() {
		super('beautify', {
			aliases: ['beautify', 'js-beautify'],
			category: 'other',
			description: {
				content: 'Beautifies code with js-beautify.',
				usage: '<code>'
			},
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					id: 'code',
					prompt: {
						start: 'What code do you want to beautify?',
						retry: 'You provided invalid code. Please try again.'
					},
					match: 'content',
					type: 'code'
				}
			]
		});
	}

	exec(msg, { code }) {
		return msg.util.send(stripIndents`
			\`\`\`${code.lang || 'js'}
			${beautify(code.code)}
			\`\`\`
		`);
	}
};
