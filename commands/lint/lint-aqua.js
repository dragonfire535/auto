const { Command } = require('discord.js-commando');
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('eslint-config-aqua');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const codeblock = /```(.|\s)+```/gi;

module.exports = class LintAquaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-aqua',
			aliases: ['lint-config-aqua'],
			group: 'lint',
			memberName: 'lint-aqua',
			description: 'Lints code with eslint-config-aqua rules.',
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code do you want to lint?',
					type: 'string',
					parse: code => {
						if (!codeblock.test(code)) return null;
						return code.match(codeblock)[0].replace(/```(js|javascript)?|```/gi, '').trim();
					}
				}
			]
		});
	}

	async run(msg, { code }) {
		if (!code) return msg.reply('Invalid message!');
		const errors = linter.verify(code, eslintConfig);
		if (!errors.length) {
			await msg.react('✅');
			return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		} else {
			await msg.react('❌');
			return msg.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				${errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``).join('\n')}
			`);
		}
	}
};
