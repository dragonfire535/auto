const { Command } = require('discord.js-commando');
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('eslint-config-aqua');
eslintConfig.rules['eol-last'] = 'off';
eslintConfig.rules.indent = ['error', 4];
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const emoji = require('../../assets/json/emoji');

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
		if (!errors.length) {
			return msg.reply(`${emoji.success.string} ${goodMessages[Math.floor(Math.random() * goodMessages.length)]}`);
		}
		let errorMap = errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``);
		if (errorMap.length > 10) {
			const len = errorMap.length - 10;
			errorMap = errorMap.slice(0, 10);
			errorMap.push(`...${len} more.`);
		}
		return msg.reply(stripIndents`
			${emoji.failure.string} ${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errorMap.join('\n')}
		`);
	}
};
