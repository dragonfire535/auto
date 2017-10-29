const { AUTO_TOKEN, AUTO_COMMAND_PREFIX, OWNERS, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: AUTO_COMMAND_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility'],
		['lint', 'Lint'],
		['other', 'Other']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`@${client.user.tag} lint to scan!`);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.login(AUTO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
