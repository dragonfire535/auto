require('dotenv').config();
const { AUTO_TOKEN, AUTO_PREFIX, OWNERS, INVITE } = process.env;
const Client = require('./structures/Client');
const client = new Client({
	prefix: AUTO_PREFIX.split('||'),
	ownerID: OWNERS.split(','),
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');
const { stripIndents } = require('common-tags');
const codeblock = /```(?:(\S+)\n)?\s*([^]+?)\s*```/i;
const runLint = msg => {
	if (msg.channel.type !== 'text' || msg.author.bot) return null;
	if (!codeblock.test(msg.content)) return null;
	if (!msg.channel.permissionsFor(msg.client.user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) return null;
	const parsed = codeblock.exec(msg.content);
	const code = {
		code: parsed[2],
		lang: parsed[1] ? parsed[1].toLowerCase() : null
	};
	return client.commandHandler.modules.get('lint').exec(msg, { code, amber: false }, true);
};

client.setup();

client.on('message', msg => runLint(msg));

client.on('messageUpdate', (oldMsg, msg) => runLint(msg));

client.on('unknownCommand', msg => msg.reply('Invalid message!'));

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.setInterval(() => {
		const activity = activities[Math.floor(Math.random() * activities.length)];
		client.user.setActivity(activity.text, { type: activity.type });
	}, 60000);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.commandHandler.on('error', (err, msg) => {
	console.error('[COMMAND ERROR]', err);
	msg.reply(stripIndents`
		An error occurred while running the command: \`${err.message}\`
		You shouldn't ever receive an error like this.
		${INVITE ? `Please visit ${INVITE} for help.` : 'Please pray for help.'}
	`).catch(() => null);
});

client.login(AUTO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
