const { Command } = require('discord.js-commando');
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('eslint-config-aqua');
eslintConfig.rules['eol-last'] = 'off';
eslintConfig.rules.indent = ['error', 4];
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');

module.exports = class LintAquaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-aqua',
			aliases: ['lint-config-aqua'],
			group: 'lint',
			memberName: 'lint-aqua',
			description: 'Lints code with eslint-config-aqua rules.',
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
		if (!code) return msg.reply('Invalid message!');
		const errors = linter.verify(code, eslintConfig);
		if (!errors.length) return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		return msg.reply(stripIndents`
			${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``).join('\n')}
		`);
	}
};
