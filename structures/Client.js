const { AkairoClient, CommandHandler } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const winston = require('winston');
const path = require('path');
const CodeType = require('../types/code');

class Client extends AkairoClient {
	constructor(options) {
		super(options);

		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, '..', 'commands'),
			prefix: msg => msg.channel.type === 'text' ? options.prefix : '',
			aliasReplacement: /-/g,
			allowMention: true,
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 60000,
			fetchMembers: true,
			defaultCooldown: 1000,
			defaultPrompt: {
				modifyStart: (text, msg) => stripIndents`
					${msg.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				modifyRetry: (text, msg) => stripIndents`
					${msg.author}, ${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				timeout: msg => `${msg.author}, cancelled command.`,
				ended: msg => `${msg.author}, 2 tries and you still don't understand, cancelled command.`,
				cancel: msg => `${msg.author}, cancelled command.`,
				retries: 2,
				stopWord: 'finish'
			}
		});
		this.logger = winston.createLogger({
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				winston.format.printf(log => `[${log.timestamp}] [${log.level.toUpperCase()}]: ${log.message}`)
			)
		});
	}

	setup() {
		this.commandHandler.loadAll();
		this.commandHandler.resolver.addType('code', CodeType);
	}
}

module.exports = Client;
