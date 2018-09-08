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

	exec(msg, { code, amber }) {
		if (!code.lang || ['js', 'javascript'].includes(code.lang)) {
			const errors = linter.verify(code.code, amber ? amberConfig : defautConfig);
			if (!errors.length) return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			const errorMap = trimArray(errors.map(err => `\`[${err.line}:${err.column}] ${err.message}\``));
			return msg.util.reply(stripIndents`
				${badMessages[Math.floor(Math.random() * badMessages.length)]}
				${errorMap.join('\n')}
			`);
		} else if (code.lang === 'json') {
			try {
				JSON.parse(code.code);
				return msg.util.reply(goodMessages[Math.floor(Math.random() * goodMessages.length)]);
			} catch (err) {
				return msg.util.reply(stripIndents`
					${badMessages[Math.floor(Math.random() * badMessages.length)]}
					\`${err.name}: ${err.message}\`
				`);
			}
		} else {
			return msg.util.reply('I don\'t know how to lint that language.');
		}
	}
};
