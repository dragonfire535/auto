const { Command } = require('discord-akairo');
const { Linter } = require('eslint');
const linter = new Linter();
const rules = linter.getRules();
const { MessageEmbed } = require('discord.js');

module.exports = class LintRuleCommand extends Command {
	constructor() {
		super('lint-rule', {
			aliases: ['lint-rule', 'eslint-rule', 'rule'],
			category: 'lint',
			description: {
				content: 'Gets information on an eslint rule.',
				usage: '<rule>'
			},
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'rule',
					prompt: {
						start: 'Which rule would you like to get information on?',
						retry: 'You provided an invalid rule. Please try again.'
					},
					match: 'content',
					type: 'lowercase'
				}
			]
		});
	}

	exec(msg, { rule }) {
		if (!rules.has(rule)) return msg.util.send('Could not find any results.');
		const data = rules.get(rule).meta;
		const embed = new MessageEmbed()
			.setAuthor('ESLint', 'https://i.imgur.com/TlurpFC.png', 'https://eslint.org/')
			.setColor(0x3A33D1)
			.setTitle(`${rule} (${data.docs.category})`)
			.setURL(`https://eslint.org/docs/rules/${rule}`)
			.setDescription(data.docs.description);
		return msg.util.send({ embed });
	}
};
