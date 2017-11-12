const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');
const toMarkdown = require('to-markdown');

module.exports = class MDNCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'mdn',
			aliases: ['mozilla-developer-network'],
			group: 'other',
			memberName: 'mdn',
			description: 'Searches MDN for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What article would you like to search for?',
					type: 'string',
					parse: query => query.replace(/#/g, '.prototype.')
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body: data } = await snekfetch
				.get('https://mdn.topkek.pw/search')
				.query({ q: query });

			if (!data.URL || !data.Title || !data.Summary) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(0x066FAD)
				.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png')
				.setURL(`https://developer.mozilla.org${data.URL}`)
				.setTitle(data.Title)
				.setDescription(toMarkdown(data.Summary));
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
