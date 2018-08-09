const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { firstUpperCase } = require('../../util/Util');

module.exports = class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'commands', 'command-list'],
			category: 'util',
			description: 'Displays a list of available commands, or detailed information for a specific command.',
			args: [
				{
					id: 'command',
					prompt: {
						start: 'Which command would you like to view the help for?',
						retry: 'You provided an invalid command. Please try again.',
						optional: true
					},
					type: 'commandAlias',
					default: ''
				}
			]
		});
	}

	async exec(msg, { command }) {
		if (!command) {
			const embed = new MessageEmbed()
				.setTitle('Command List')
				.setColor(0x00AE86)
				.setFooter(`${this.handler.modules.size} Commands`);
			for (const category of this.handler.categories.values()) {
				embed.addField(
					`❯ ${this.parseCategoryName(category.id)}`,
					category.map(cmd => `\`${cmd.id}\``).join(', ') || 'None'
				);
			}
			try {
				const msgs = [];
				msgs.push(await msg.author.send({ embed }));
				if (msg.channel.type !== 'dm') msgs.push(await msg.util.send('📬 Sent you a DM with information.'));
				return msgs;
			} catch (err) {
				return msg.util.reply('Failed to send DM. You probably have DMs disabled.');
			}
		}
		return msg.util.send(stripIndents`
			__Command **${command.id}**__${command.channel === 'guild' ? ' (Usable only in servers)' : ''}
			${command.description}${command.ownerOnly ? '\n⚠ Only the bot owner may use this command. ⚠' : ''}

			**Format**: \`${command.id}${command.args.args.length ? ` ${this.makeArgList(command.args)}` : ''}\`
			**Aliases**: ${command.aliases.join(', ')}
			**Group**: ${this.parseCategoryName(command.categoryID)}
		`);
	}

	parseCategoryName(id) {
		return id.split('-').map(word => firstUpperCase(word)).join(' ');
	}

	makeArgList(args) {
		return args.map(arg => {
			let result = '';
			result += args.optional ? '[' : '<';
			if (arg.prompt.infinite) result += '...';
			result += arg.id;
			result += args.optional ? ']' : '>';
			return result;
		}).join(' ');
	}
};
