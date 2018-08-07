// Credit: https://github.com/discordjs/Commando/blob/master/src/commands/util/eval.js
const { Command } = require('discord-akairo');
const util = require('util');
const discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { escapeRegex } = require('../../util/Util');
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');

module.exports = class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval'],
			category: 'util',
			description: {
				content: 'Executes JavaScript code.',
				usage: '<script>',
				details: 'Only the bot owner(s) may use this command.'
			},
			ownerOnly: true,
			args: [
				{
					id: 'script',
					prompt: {
						start: 'What code would you like to evaluate?',
						retry: 'You provided an invalid script. Please try again.'
					},
					match: 'content',
					type: 'code'
				}
			]
		});

		this.lastResult = null;
	}

	exec(msg, { script }) {
		/* eslint-disable no-unused-vars */
		const { client, lastResult } = this;
		const doReply = val => {
			if (val instanceof Error) {
				msg.reply(`Callback error: \`${val}\``);
			} else {
				const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
				if (Array.isArray(result)) {
					for (const item of result) msg.reply(item);
				} else {
					msg.reply(result);
				}
			}
		};
		/* eslint-enable no-unused-vars */

		let hrDiff;
		try {
			const hrStart = process.hrtime();
			this.lastResult = eval(script.code);
			hrDiff = process.hrtime(hrStart);
		} catch (err) {
			return msg.util.reply(`Error while evaluating: \`${err}\``);
		}

		this.hrStart = process.hrtime();
		return msg.util.reply(this.makeResultMessages(this.lastResult, hrDiff, script.code));
	}

	makeResultMessages(result, hrDiff, input = null) {
		const inspected = util.inspect(result, { depth: 0 })
			.replace(nlPattern, '\n')
			.replace(this.sensitivePattern, '--snip--');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\''
			? split[split.length - 1]
			: inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if (input) {
			return discord.splitMessage(stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		} else {
			return discord.splitMessage(stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		}
	}

	get sensitivePattern() {
		if (!this._sensitivePattern) {
			let pattern = '';
			if (this.client.token) pattern += escapeRegex(this.client.token);
			Object.defineProperty(this, '_sensitivePattern', { value: new RegExp(pattern, 'gi') });
		}
		return this._sensitivePattern;
	}
};
