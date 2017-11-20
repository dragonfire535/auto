const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { util: { disambiguation } } = require('discord.js-commando');

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
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, { command }) {
		const commands = this.client.registry.findCommands(command, false, msg);
		if (command) {
			if (commands.length === 1) {
				const data = commands[0];
				return msg.say(stripIndents`
					__Command **${data.name}**__${data.nsfw ? ' (NSFW)' : ''}${data.guildOnly ? ' (Usable only in servers)' : ''}
					${data.description} ${data.details ? `\n_${data.details}_` : ''}

					**Format**: ${msg.anyUsage(`${data.name} ${data.format || ''}`)}
					**Aliases**: ${data.aliases.join(', ') || 'None'}
					**Group**: ${data.group.name} (\`${data.groupID}:${data.memberName}\`)
				`);
			} else if (commands.length > 15) {
				return msg.say('Multiple commands found. Please be more specific.');
			} else if (commands.length > 1) {
				return msg.say(disambiguation(commands, 'commands'));
			}
			return msg.say(`Could not identify command. Use ${msg.usage(null)} to view a list of commands.`);
		} else {
			const embed = new MessageEmbed()
				.setTitle('Command List')
				.setDescription(`Use ${msg.usage('<command>')} to view detailed information about a command.`)
				.setColor(0x00AE86);
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
	}
};
