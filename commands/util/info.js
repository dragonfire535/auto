const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../package');
const { duration } = require('../../util/Util');
const { INVITE } = process.env;

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
			.setFooter('©2017-2018 dragonfire535#8081')
			.addField('❯ Servers', this.client.guilds.size, true)
			.addField('❯ Shards', this.client.options.shardCount, true)
			.addField('❯ Commands', this.handler.modules.size, true)
			.addField('❯ Home Server', INVITE ? `[Here](${INVITE})` : 'None', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', duration(this.client.uptime), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node Version', process.version, true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org) + [discord-akairo](https://github.com/1Computer1/discord-akairo)', true);
		return msg.util.send({ embed });
	}
};
