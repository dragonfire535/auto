const { Command } = require('discord-akairo');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const config = require('../../assets/json/eslint-default');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');

module.exports = class LintDefaultCommand extends Command {
	constructor() {
		super('lint-default', {
			aliases: ['lint-default', 'lint-recommended', 'lint', 'eslint', 'eslint-default', 'eslint-recommended'],
			category: 'lint',
			description: {
				content: 'Lints code with the recommended rules.',
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
		if (code.lang && !['js', 'javascript'].includes(code.lang)) {
			return msg.util.reply('Only `js` or `javascript` codeblocks should be linted with this command.');
		}
		const errors = linter.verify(code.code, config);
		if (!errors.length) return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
		return msg.util.reply(stripIndents`
			${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errorMap.join('\n')}
		`);
	}
};
