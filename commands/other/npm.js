const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = class NPMCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'npm',
			aliases: ['npm-package'],
			group: 'other',
			memberName: 'npm',
			description: 'Gets information on an NPM package.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What package would you like to get information on?',
					type: 'string',
					parse: query => encodeURIComponent(query.replace(/ /g, '-'))
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const { body } = await snekfetch.get(`https://registry.npmjs.com/${query}`);
			const version = body.versions[body['dist-tags'].latest];
			let maintainers = body.maintainers.map(user => user.name);
			if (maintainers.length > 10) {
				const len = maintainers.length - 10;
				maintainers = maintainers.slice(0, 10);
				maintainers.push(`...${len} more.`);
			}
			let dependencies = version.dependencies ? Object.keys(version.dependencies) : null;
			if (dependencies && dependencies.length > 10) {
				const len = dependencies.length - 10;
				dependencies = dependencies.slice(0, 10);
				dependencies.push(`...${len} more.`);
			}
			const embed = new MessageEmbed()
				.setColor(0xCB0000)
				.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png')
				.setTitle(body.name)
				.setURL(`https://www.npmjs.com/package/${query}`)
				.setDescription(body.description || 'No description.')
				.addField('❯ Version',
					body['dist-tags'].latest, true)
				.addField('❯ License',
					body.license || 'None', true)
				.addField('❯ Author',
					body.author ? body.author.name : 'Unknown', true)
				.addField('❯ Created',
					new Date(body.time.created).toDateString(), true)
				.addField('❯ Modified',
					new Date(body.time.modified).toDateString(), true)
				.addField('❯ Main File',
					version.main, true)
				.addField('❯ Dependencies',
					dependencies ? dependencies.join(', ') : 'None')
				.addField('❯ Maintainers',
					maintainers.join(', '));
			return msg.embed(embed);
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
