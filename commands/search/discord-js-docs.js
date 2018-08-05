const Command = require('../../structures/Command');
const request = require('node-superfetch');
const branches = ['stable', 'master', 'rpc', 'commando'];

module.exports = class DiscordJSDocsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'discord-js-docs',
			aliases: ['djs-docs', 'docs', 'djs', 'discord-js'],
			group: 'search',
			memberName: 'discord-js-docs',
			description: 'Searches the Discord.js docs for your query.',
			patterns: [/^(?:docs,) (.+)/i],
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'query',
					prompt: 'What would you like to search the docs for?',
					type: 'string',
					parse: query => query.toLowerCase()
				}
			]
		});
	}

	async run(msg, { query }, pattern) {
		if (pattern) [, query] = msg.patternMatches;
		let project = 'main';
		let branch = query.split(' ');
		if (branches.includes(branch[0])) {
			query = branch.slice(1).join(' ');
			branch = branch[0];
		} else {
			branch = 'master';
		}
		if (branch === 'commando' || branch === 'rpc') {
			project = branch;
			branch = 'master';
		}
		try {
			const { body } = await request
				.get(`https://djsdocs.sorta.moe/${project}/${branch}/embed`)
				.query({ q: query });
			return msg.embed(body);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
