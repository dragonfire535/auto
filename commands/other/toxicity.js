const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');
const { GOOGLE_KEY } = process.env;

module.exports = class ToxicityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'toxicity',
			aliases: ['perspective', 'comment-toxicity'],
			group: 'other',
			memberName: 'toxicity',
			description: 'Determines the toxicity of text.',
			args: [
				{
					key: 'text',
					prompt: 'What text do you want to test the toxicity of?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			const { body } = await snekfetch
				.post('https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze')
				.query({ key: GOOGLE_KEY })
				.send({
					comment: { text },
					languages: ['en'],
					requestedAttributes: { TOXICITY: {} }
				});
			const toxicity = Math.round(body.attributeScores.TOXICITY.summaryScore.value * 100);
			if (toxicity >= 70) return msg.say(`Likely to be perceived as toxic. (${toxicity}%)`);
			if (toxicity >= 40) return msg.say(`Unsure if this will be perceived as toxic. (${toxicity}%)`);
			return msg.say(`Unlikely to be perceived as toxic. (${toxicity}%)`);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
