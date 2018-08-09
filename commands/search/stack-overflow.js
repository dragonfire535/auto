const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { STACKOVERFLOW_KEY } = process.env;

module.exports = class StackOverflowCommand extends Command {
	constructor() {
		super('stack-overflow', {
			aliases: ['stack-overflow', 'stack-exchange'],
			category: 'search',
			description: 'Searches Stack Overflow for your query.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'query',
					prompt: {
						start: 'What question would you like to search for?',
						retry: 'You provided an invalid query. Please try again.'
					},
					match: 'content',
					type: 'string'
				}
			]
		});
	}

	async exec(msg, { query }) {
		try {
			const { body } = await request
				.get('http://api.stackexchange.com/2.2/search/advanced')
				.query({
					page: 1,
					pagesize: 1,
					order: 'asc',
					sort: 'relevance',
					answers: 1,
					tags: 'javascript',
					q: query,
					site: 'stackoverflow',
					key: STACKOVERFLOW_KEY
				});
			if (!body.items.length) return msg.util.send('Could not find any results.');
			const data = body.items[0];
			const embed = new MessageEmbed()
				.setColor(0xF48023)
				.setAuthor('Stack Overflow', 'https://i.imgur.com/P2jAgE3.png', 'https://stackoverflow.com/')
				.setURL(data.link)
				.setTitle(data.title)
				.addField('❯ ID', data.question_id, true)
				.addField('❯ Asker', `[${data.owner.display_name}](${data.owner.link})`, true)
				.addField('❯ Views', data.view_count, true)
				.addField('❯ Score', data.score, true)
				.addField('❯ Creation Date', new Date(data.creation_date * 1000).toDateString(), true)
				.addField('❯ Last Activity', new Date(data.last_activity_date * 1000).toDateString(), true);
			return msg.util.send({ embed });
		} catch (err) {
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
