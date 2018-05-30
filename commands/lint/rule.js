const Command = require('../../structures/Command');
const { Linter } = require('eslint');
const linter = new Linter();
const rules = linter.getRules();
const { MessageEmbed } = require('discord.js');

module.exports = class LintRuleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lint-rule',
			aliases: ['eslint-rule', 'rule'],
			group: 'lint',
			memberName: 'rule',
			description: 'Gets information on an eslint rule.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'rule',
					prompt: 'Which rule would you like to get information on?',
					type: 'string',
					parse: rule => rule.toLowerCase().replace(/ /g, '-')
				}
			]
		});
	}

	run(msg, { rule }) {
		if (!rules.has(rule)) return msg.say('Could not find any results.');
		const data = rules.get(rule).meta;
		const embed = new MessageEmbed()
			.setAuthor('ESLint', 'https://i.imgur.com/TlurpFC.png', 'https://eslint.org/')
			.setColor(0x3A33D1)
			.setTitle(`${rule} (${data.docs.category})`)
			.setURL(`https://eslint.org/docs/rules/${rule}`)
			.setDescription(data.docs.description);
		return msg.embed(embed);
	}
};
