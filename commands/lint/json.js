const { Command } = require('discord.js-commando');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const json = require('eslint-plugin-json').processors['.json'];
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

	async run(msg, { code }, pattern, updated) {
		if (!code) {
			if (pattern) return null;
			return msg.reply('Invalid message!');
		}
		if (code.lang && code.lang !== 'json') {
			if (pattern) return null;
			return msg.reply('Only `json` codeblocks should be linted with this command.');
		}
		const errors = linter.verify(code.code, undefined, {
			filename: 'file.json',
			preprocess: json.preprocess,
			postprocess: json.postprocess
		});
		if (pattern && updated) {
			if (msg.reactions.has('❌') && msg.reactions.get('❌').users.has(this.client.user.id)) {
				await msg.reactions.get('❌').remove();
			}
			if (msg.reactions.has('✅') && msg.reactions.get('✅').users.has(this.client.user.id)) {
				await msg.reactions.get('✅').remove();
			}
		}
		if (!errors.length) {
			if (pattern) {
				await msg.react('✅');
				return null;
			}
			return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		}
		const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
		if (pattern) {
			await msg.react('❌');
			const filter = (reaction, user) => user.id === msg.author.id && reaction.emoji.name === '❌';
			const reactions = await msg.awaitReactions(filter, {
				max: 1,
				time: 30000
			});
			if (!reactions.size) return null;
		}
		return msg.reply(stripIndents`
			${badMessages[Math.floor(Math.random() * badMessages.length)]}
			${errorMap.join('\n')}
		`);
	}
};
