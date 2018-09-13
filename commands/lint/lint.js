const { Command } = require('discord-akairo');
const { Linter } = require('eslint');
const linter = new Linter();
const { stripIndents } = require('common-tags');
const { trimArray } = require('../../util/Util');
const defautConfig = require('../../assets/json/eslint-default');
const amberConfig = require('eslint-config-amber');
amberConfig.rules['eol-last'] = 'off';
amberConfig.rules.indent = ['error', 4];
const goodMessages = require('../../assets/json/good-messages');
const badMessages = require('../../assets/json/bad-messages');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;
const supported = ['javascript', 'js', 'json'];

module.exports = class LintCommand extends Command {
	constructor() {
		super('lint', {
			aliases: ['lint', 'eslint'],
			category: 'lint',
			description: 'Lints code.',
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
				},
				{
					id: 'amber',
					match: 'flag',
					flag: ['--amber', '-a']
				}
			]
		});
	}

	async exec(msg, { code, amber }, reaction) {
		if (code.lang && !supported.includes(code.lang)) {
			if (reaction) return null;
			return msg.util.reply('I don\'t know how to lint that language.');
		}
		if (reaction) await this.resetReactions(msg);
		if (!code.lang || ['js', 'javascript'].includes(code.lang)) {
			const errors = linter.verify(code.code, amber ? amberConfig : defautConfig);
			if (!errors.length) {
				if (reaction) return this.reactSuccess(msg);
				return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			}
			const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
			if (reaction) {
				const reply = await this.reactFailure(msg);
				if (!reply) return null;
			}
			return msg.util.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				${errorMap.join('\n')}
			`);
		}
		if (code.lang === 'json') {
			try {
				JSON.parse(code.code);
				if (reaction) return this.reactSuccess(msg);
				return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			} catch (err) {
				if (reaction) {
					const reply = await this.reactFailure(msg);
					if (!reply) return null;
				}
				return msg.util.reply(stripIndents`
					${badMessages[Math.floor(Math.random() * badMessages.length)]}
					\`${err.name}: ${err.message}\`
				`);
			}
		}
		return null;
	}

	async resetReactions(msg) {
		const failReaction = msg.reactions.get(FAILURE_EMOJI_ID);
		if (failReaction && !failReaction.users.size) await failReaction.users.fetch();
		if (failReaction && failReaction.users.has(this.client.user.id)) {
			await failReaction.users.remove(this.client.user);
		}
		const successReaction = msg.reactions.get(SUCCESS_EMOJI_ID);
		if (successReaction && !successReaction.users.size) await successReaction.users.fetch();
		if (successReaction && successReaction.users.has(this.client.user.id)) {
			await successReaction.users.remove(this.client.user);
		}
	}

	async reactSuccess(msg) {
		try {
			await msg.react(SUCCESS_EMOJI_ID);
			return null;
		} catch (err) {
			return null;
		}
	}

	async reactFailure(msg) {
		try {
			await msg.react(FAILURE_EMOJI_ID);
			const filter = (reaction, user) => user.id === msg.author.id && reaction.emoji.id === FAILURE_EMOJI_ID;
			const reactions = await msg.awaitReactions(filter, {
				max: 1,
				time: 30000
			});
			if (!reactions.size) return false;
			return true;
		} catch (err) {
			return false;
		}
	}
};
