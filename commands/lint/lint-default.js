const { Command } = require('discord.js-commando');
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('../../assets/json/eslint-default');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const emoji = require('../../assets/json/emoji');

module.exports = class LintDefaultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-default',
			aliases: ['lint-recommended', 'lint'],
			group: 'lint',
			memberName: 'lint-default',
			description: 'Lints code with the recommended rules.',
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

	async run(msg, { code }, pattern) {
		if (!code) {
			if (pattern) return null;
			return msg.reply('Invalid message!');
		}
		const errors = linter.verify(code, eslintConfig);
		if (!errors.length) {
			if (pattern) {
				await msg.react(emoji.success.id);
				return null;
			}
			return msg.reply(`${emoji.success.string} ${goodMessages[Math.floor(Math.random() * goodMessages.length)]}`);
		}
		if (pattern) {
			await msg.react(emoji.failure.id);
			return null;
		}
		let errorMap = errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``);
		if (errorMap.length > 10) {
			const len = errorMap.length;
			errorMap = errorMap.slice(0, 10);
			errorMap.push(`...${len} more.`);
		}
		return msg.reply(stripIndents`
			${emoji.failure.string} ${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errorMap.join('\n')}
		`);
	}
};
