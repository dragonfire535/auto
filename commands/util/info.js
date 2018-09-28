const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const { version, dependencies } = require('../../package');
const { INVITE, AUTO_GITHUB_REPO_USERNAME, AUTO_GITHUB_REPO_NAME } = process.env;
const source = AUTO_GITHUB_REPO_NAME && AUTO_GITHUB_REPO_USERNAME;

module.exports = class InfoCommand extends Command {
	constructor() {
		super('info', {
			aliases: ['info', 'information', 'stats'],
			category: 'util',
			description: 'Responds with detailed bot information.',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	exec(msg) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2018 dragonfire535#8081')
			.addField('❯ Servers', this.client.guilds.size, true)
			.addField('❯ Shards', this.client.options.shardCount, true)
			.addField('❯ Commands', this.handler.modules.size, true)
			.addField('❯ Home Server', INVITE ? `[Here](${INVITE})` : 'None', true)
			.addField('❯ Source Code',
				source ? `[Here](https://github.com/${AUTO_GITHUB_REPO_USERNAME}/${AUTO_GITHUB_REPO_NAME})` : 'N/A', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('hh:mm:ss', { trim: false }), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node Version', process.version, true)
			.addField('❯ Dependencies', this.parseDependencies());
		return msg.util.send({ embed });
	}

	parseDependencies() {
		return Object.entries(dependencies).map(dep => {
			if (dep[1].startsWith('github:')) {
				const repo = dep[1].replace('github:', '').split('/');
				return `[${dep[0]}](https://github.com/${repo[0]}/${repo[1].replace(/#.+/, '')})`;
			}
			return `[${dep[0]}](https://npmjs.com/${dep[0]})`;
		}).join(', ');
	}
};
