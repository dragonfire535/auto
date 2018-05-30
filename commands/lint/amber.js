const Command = require('../../structures/Command');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const config = require('eslint-config-amber');
config.rules['eol-last'] = 'off';
config.rules.indent = ['error', 4];
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');

module.exports = class LintAmberCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-amber',
			aliases: ['lint-config-amber', 'eslint-amber', 'eslint-config-amber'],
			group: 'lint',
			memberName: 'amber',
			description: 'Lints code with eslint-config-amber rules.',
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
		if (code.lang && !['js', 'javascript'].includes(code.lang)) {
			return msg.reply('Only `js` or `javascript` codeblocks should be linted with this command.');
		}
		const errors = linter.verify(code.code, config);
		if (!errors.length) return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
		return msg.reply(stripIndents`
			${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errorMap.join('\n')}
		`);
	}
};
