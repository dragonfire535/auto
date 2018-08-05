const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');

module.exports = class LintJSONCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-json',
			aliases: ['eslint-json', 'eslint-plugin-json'],
			group: 'lint',
			memberName: 'json',
			description: 'Lints JSON.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to lint?',
					type: 'code'
				}
			]
		});
	}

	run(msg, { code }) {
		if (code.lang && code.lang !== 'json') {
			return msg.reply('Only `json` codeblocks should be linted with this command.');
		}
		try {
			JSON.parse(code.code);
			return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		} catch (err) {
			return msg.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				\`${err.name}: ${err.message}\`
			`);
		}
	}
};
