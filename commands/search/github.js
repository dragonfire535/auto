const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('superagent');
const { shorten, base64 } = require('../../util/Util');
const { GITHUB_USERNAME, GITHUB_PASSWORD } = process.env;

module.exports = class GithubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'github',
			aliases: ['github-repository', 'github-repo', 'git-repo'],
			group: 'search',
			memberName: 'github',
			description: 'Responds with information on a GitHub repository.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'author',
					prompt: 'Who is the author of the repository?',
					type: 'string',
					parse: author => encodeURIComponent(author)
				},
				{
					key: 'repository',
					prompt: 'What is the name of the repository?',
					type: 'string',
					parse: repository => encodeURIComponent(repository)
				}
			]
		});
	}

	async run(msg, { author, repository }) {
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
			return msg.embed(embed);
		} catch (err) {
			if (err.statusCode === 404) return msg.say('Could not find any results.');
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
