const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');

module.exports = class LintJSONCommand extends Command {
	constructor() {
		super('lint-json', {
			aliases: ['lint-json', 'eslint-json', 'eslint-plugin-json'],
			category: 'lint',
			description: {
				content: 'Lints JSON.',
				usage: '<code>'
			},
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					id: 'code',
					prompt: {
						start: 'What code do you want to lint?',
						retry: 'You provided invalid code. Please try again.'
					},
					match: 'content',
					type: 'code'
				}
			]
		});
	}

	exec(msg, { code }) {
		if (code.lang && code.lang !== 'json') {
			return msg.util.reply('Only `json` codeblocks should be linted with this command.');
		}
		try {
			JSON.parse(code.code);
			return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		} catch (err) {
			return msg.util.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				\`${err.name}: ${err.message}\`
			`);
		}
	}
};
