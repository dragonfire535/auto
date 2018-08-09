const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const Turndown = require('turndown');

module.exports = class MDNCommand extends Command {
	constructor() {
		super('mdn', {
			aliases: ['mdn', 'mozilla-developer-network'],
			category: 'search',
			description: 'Searches MDN for your query.',
			regex: /^(?:mdn,) (.+)/i,
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'query',
					prompt: {
						start: 'What article would you like to search for?',
						retry: 'You provided an invalid query. Please try again.'
					},
					match: 'content',
					type: query => query.replace(/#/g, '.prototype.')
				}
			]
		});
	}

	async exec(msg, { query, match }) {
		if (!query && match) [, query] = match;
		try {
			const { body } = await request
				.get('https://mdn.topkek.pw/search')
				.query({ q: query });
			if (!body.URL || !body.Title || !body.Summary) return msg.util.send('Could not find any results.');
			const turndown = new Turndown();
			turndown.addRule('hyperlink', {
				filter: 'a',
				replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
			});
			const embed = new MessageEmbed()
				.setColor(0x066FAD)
				.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
				.setURL(`https://developer.mozilla.org${body.URL}`)
				.setTitle(body.Title)
				.setDescription(turndown.turndown(body.Summary));
			return msg.util.send({ embed });
		} catch (err) {
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
