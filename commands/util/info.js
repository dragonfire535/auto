const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { version } = require('../../package');
const { duration } = require('../../util/Util');

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['information', 'stats'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017-2018 dragonfire535#8081')
			.addField('❯ Servers',
				this.client.guilds.size, true)
			.addField('❯ Shards',
				this.client.options.shardCount, true)
			.addField('❯ Commands',
				this.client.registry.commands.size, true)
			.addField('❯ Home Server',
				this.client.options.invite ? `[Here](${this.client.options.invite})` : 'None', true)
			.addField('❯ Memory Usage',
				`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime',
				duration(this.client.uptime), true)
			.addField('❯ Version',
				`v${version}`, true)
			.addField('❯ Node Version',
				process.version, true)
			.addField('❯ Library',
				'[discord.js](https://discord.js.org)[-commando](https://github.com/Gawdl3y/discord.js-commando)', true);
		return msg.embed(embed);
	}
};
