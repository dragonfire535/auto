const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { trimArray } = require('../../util/Util');

module.exports = class NPMCommand extends Command {
	constructor() {
		super('npm', {
			aliases: ['npm', 'npm-package'],
			category: 'search',
			description: {
				content: 'Responds with information on an NPM package.',
				usage: '<package>'
			},
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'pkg',
					prompt: {
						start: 'What package would you like to get information on?',
						retry: 'You provided an invalid package. Please try again.'
					},
					match: 'content',
					type: 'url-encoded'
				}
			]
		});
	}

	async exec(msg, { pkg }) {
		try {
			const { body } = await request.get(`https://registry.npmjs.com/${pkg}`);
			if (body.time.unpublished) return msg.util.send('This package no longer exists.');
			const version = body.versions[body['dist-tags'].latest];
			const maintainers = trimArray(body.maintainers.map(user => user.name));
			const dependencies = version.dependencies ? trimArray(Object.keys(version.dependencies)) : null;
			const embed = new MessageEmbed()
				.setColor(0xCB0000)
				.setAuthor('NPM', 'https://i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com/')
				.setTitle(body.name)
				.setURL(`https://www.npmjs.com/package/${pkg}`)
				.setDescription(body.description || 'No description.')
				.addField('❯ Version', body['dist-tags'].latest, true)
				.addField('❯ License', body.license || 'None', true)
				.addField('❯ Author', body.author ? body.author.name : '???', true)
				.addField('❯ Creation Date', new Date(body.time.created).toDateString(), true)
				.addField('❯ Modification Date', new Date(body.time.modified).toDateString(), true)
				.addField('❯ Main File', version.main || 'index.js', true)
				.addField('❯ Dependencies', dependencies && dependencies.length ? dependencies.join(', ') : 'None')
				.addField('❯ Maintainers', maintainers.join(', '));
			return msg.util.send({ embed });
		} catch (err) {
			if (err.status === 404) return msg.util.send('Could not find any results.');
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
