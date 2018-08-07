const { IA_TOKEN, IA_PREFIX, OWNERS } = process.env;
const Client = require('./structures/Client');
const client = new Client({
	prefix: IA_PREFIX.split('||'),
	ownerID: OWNERS.split(','),
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');

client.commandHandler.loadAll();

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

client.commandHandler.on('error', (err, msg, command) => {
	console.error('[COMMAND ERROR]', command ? command.id : 'None', err);
});

client.login(IA_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
