const { Command } = require('discord.js-commando');
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('../../assets/json/eslint-default');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const codeblock = /```(js|javascript)?\n(.+)\n```/gi;

module.exports = class LintDefaultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-default',
			aliases: ['lint-recommended', 'lint'],
			group: 'lint',
			memberName: 'lint-default',
			description: 'Lints code with the recommended rules.',
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to lint?',
					type: 'string',
					parse: code => {
						if (!codeblock.test(code)) return null;
						return codeblock.exec(code)[1];
					}
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
			await msg.react('✅');
			if (pattern) return null;
			return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		} else {
			await msg.react('❌');
			if (pattern) return null;
			return msg.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				${errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``).join('\n')}
			`);
		}
	}
};
