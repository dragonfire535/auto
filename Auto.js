const { AUTO_TOKEN } = process.env;
const { Client } = require('discord.js');
const client = new Client({
	disableEveryone: true,
	disabledEvents: ['TYPING_START']
});
const { linter } = require('eslint');
const { stripIndents } = require('common-tags');
const eslintConfig = require('./assets/json/eslintConfig');
const goodMessages = require('./assets/json/goodMessages');
const badMessages = require('./assets/json/badMessages');

client.on('ready', () => {
	console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity(`@${client.user.tag} to scan!`);
});

client.on('disconnect', event => {
	console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	process.exit(0);
});

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

const validMessage = /```(.|\s)+```/gi;
client.on('message', async msg => {
	if (!validMessage.test(msg.content)) {
		if (msg.mentions.has(client.user.id)) await msg.reply('Invalid message!');
		return;
	}
	const test = msg.content.match(validMessage)[0].replace(/```(js|javascript)?|```/gi, '').trim();
	const errors = linter.verify(test, eslintConfig);
	if (!errors.length) {
		await msg.react('✅');
		if (msg.mentions.has(client.user.id)) {
			const resultMsg = goodMessages[Math.floor(Math.random() * goodMessages.length)];
			await msg.reply(resultMsg);
		}
	} else {
		await msg.react('❌');
		if (msg.mentions.has(client.user.id)) {
			const resultMsg = badMessages[Math.floor(Math.random() * badMessages.length)];
			await msg.reply(stripIndents`
				${resultMsg}
				${errors.map(err => `\`${err.line}:${err.column} ${err.message}\``).join('\n')}
			`);
		}
	}
});

client.login(AUTO_TOKEN);

process.on('unhandledRejection', err => {
	console.error('[FATAL] Unhandled Promise Rejection.', err);
	process.exit(1);
});
