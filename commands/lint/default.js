const { Command } = require('discord.js-commando');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const config = require('../../assets/json/eslint-default');
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class LintDefaultCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-default',
			aliases: ['lint-recommended', 'lint', 'eslint', 'eslint-default', 'eslint-recommended'],
			group: 'lint',
			memberName: 'default',
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

	async run(msg, { code }, pattern, updated) {
		if (!code) {
			if (pattern) return null;
			return msg.reply('Invalid message!');
		}
		if (code.lang && !['js', 'javascript'].includes(code.lang)) {
			if (pattern) return null;
			return msg.reply('Only `js` or `javascript` codeblocks should be linted with this command.');
		}
		const errors = linter.verify(code.code, config);
		if (pattern && updated) {
			if (msg.reactions.has(FAILURE_EMOJI_ID) && msg.reactions.get(FAILURE_EMOJI_ID).users.has(this.client.user.id)) {
				await msg.reactions.get(FAILURE_EMOJI_ID).remove();
			}
			if (msg.reactions.has(SUCCESS_EMOJI_ID) && msg.reactions.get(SUCCESS_EMOJI_ID).users.has(this.client.user.id)) {
				await msg.reactions.get(SUCCESS_EMOJI_ID).remove();
			}
		}
		if (!errors.length) {
			if (pattern) {
				await msg.react(SUCCESS_EMOJI_ID);
				return null;
			}
			return msg.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
		}
		const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
		if (pattern) {
			await msg.react(FAILURE_EMOJI_ID);
			const filter = (reaction, user) => user.id === msg.author.id && reaction.emoji.id === FAILURE_EMOJI_ID;
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
