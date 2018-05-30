const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'command-list'],
			group: 'util',
			memberName: 'help',
			description: 'Displays a list of available commands, or detailed information for a specific command.',
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'command',
					default: ''
				}
			]
		});
	}

	async run(msg, { command }) {
		if (!command) {
			const embed = new MessageEmbed()
				.setTitle('Command List')
				.setDescription(`Use ${msg.usage('<command>')} to view detailed information about a command.`)
				.setColor(0x00AE86)
				.setFooter(`${this.client.registry.commands.size} Commands`);
			for (const group of this.client.registry.groups.values()) {
				embed.addField(`❯ ${group.name}`, group.commands.map(cmd => cmd.name).join(', ') || 'None');
			}
			try {
				const msgs = [];
				msgs.push(await msg.direct({ embed }));
				if (msg.channel.type !== 'dm') msgs.push(await msg.say('📬 Sent you a DM with information.'));
				return msgs;
			} catch (err) {
				return msg.reply('Failed to send DM. You probably have DMs disabled.');
			}
		}
		return msg.say(stripIndents`
			__Command **${command.name}**__${command.guildOnly ? ' (Usable only in servers)' : ''}
			${command.description}${command.details ? `\n_${command.details}_` : ''}

			**Format**: ${msg.anyUsage(`${command.name} ${command.format || ''}`)}
			**Aliases**: ${command.aliases.join(', ') || 'None'}
			**Group**: ${command.group.name} (\`${command.groupID}:${command.memberName}\`)
		`);
	}
};
