const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const { shorten, base64 } = require('../../util/Util');
const { GITHUB_USERNAME, GITHUB_PASSWORD } = process.env;

module.exports = class GithubCommand extends Command {
	constructor() {
		super('github', {
			aliases: ['github', 'github-repository', 'github-repo', 'git-repo'],
			category: 'search',
			description: 'Responds with information on a GitHub repository.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'author',
					prompt: {
						start: 'Who is the author of the repository?',
						retry: 'You provided an invalid author. Please try again.'
					},
					type: author => encodeURIComponent(author)
				},
				{
					id: 'repository',
					prompt: {
						start: 'What is the name of the repository?',
						retry: 'You provided an invalid repository. Please try again.'
					},
					type: repository => encodeURIComponent(repository)
				}
			]
		});
	}

	async exec(msg, { author, repository }) {
		try {
			const { body } = await request
				.get(`https://api.github.com/repos/${author}/${repository}`)
				.set({ Authorization: `Basic ${base64(`${GITHUB_USERNAME}:${GITHUB_PASSWORD}`)}` });
			const embed = new MessageEmbed()
				.setColor(0xFFFFFF)
				.setAuthor('GitHub', 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
				.setTitle(body.full_name)
				.setURL(body.html_url)
				.setDescription(body.description ? shorten(body.description) : 'No description.')
				.setThumbnail(body.owner.avatar_url)
				.addField('❯ Stars', body.stargazers_count, true)
				.addField('❯ Forks', body.forks, true)
				.addField('❯ Issues', body.open_issues, true)
				.addField('❯ Language', body.language || '???', true)
				.addField('❯ Creation Date', new Date(body.created_at).toDateString(), true)
				.addField('❯ Modification Date', new Date(body.updated_at).toDateString(), true);
			return msg.util.send({ embed });
		} catch (err) {
			if (err.status === 404) return msg.util.send('Could not find any results.');
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
