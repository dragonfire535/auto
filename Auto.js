const { AUTO_TOKEN, AUTO_PREFIX, OWNERS, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: AUTO_PREFIX,
	owner: OWNERS.split(','),
	invite: INVITE,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: ['TYPING_START']
});
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;
const runLint = (msg, updated = false) => {
	if (msg.channel.type !== 'text' || msg.author.bot) return;
	if (!codeblock.test(msg.content)) return;
	if (msg.channel.topic && msg.channel.topic.includes('<auto:no-scan>')) return;
	if (!msg.channel.permissionsFor(msg.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) return;
	const parsed = codeblock.exec(msg.content);
	const code = {
		code: parsed[2],
		lang: parsed[1] ? parsed[1].toLowerCase() : null
	};
	if (code.lang === 'json') msg.client.registry.resolveCommand('lint:json').run(msg, { code }, true, updated);
	else msg.client.registry.resolveCommand('lint:default').run(msg, { code }, true, updated);
};

client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
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

client.on('message', runLint);

client.on('messageUpdate', (oldMsg, msg) => runLint(msg, true));

client.on('unknownCommand', msg => msg.reply('Invalid message!'));

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('for bad code', { type: 'WATCHING' });
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('commandRun', command => console.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}.`));

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.login(AUTO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
