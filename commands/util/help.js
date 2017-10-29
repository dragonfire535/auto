const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			aliases: ['commands', 'command-list'],
			group: 'util',
			memberName: 'help',
			description: 'Displays a list of available commands, or detailed information for a specified command.',
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
					__**Command ${data.name}**__
					${data.description} ${data.details ? `\n_${data.details}_` : ''}

					**Format**: ${msg.anyUsage(`${data.name} ${data.format || ''}`)}
					**Aliases**: ${data.aliases.join(', ') || 'None'}
					**Group**: ${data.group.name}
				`);
			} else if (commands.length > 1) {
				return msg.say(`Multiple commands found: ${commands.map(c => c.name).join(', ')}`);
			}
			return msg.say(`Could not identify command. Use ${msg.usage(null)} to view a list of commands.`);
		} else {
			const embed = new MessageEmbed()
				.setTitle('Command List')
				.setDescription(`Use ${msg.usage('<command>')} to view detailed information about a command.`)
				.setColor(0x00AE86);
			for (const group of this.client.registry.groups.values()) {
				embed.addField(`❯ ${group.name}`, group.commands.map(c => c.name).join(', ') || 'None');
			}
			try {
				await msg.direct({ embed });
				return msg.say('📬 Sent you a DM with information.');
			} catch (err) {
				return msg.reply('Failed to send DM. You probably have DMs disabled.');
			}
		}
	}
};
