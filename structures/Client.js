const { AkairoClient, CommandHandler } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const fs = require('fs');
const path = require('path');
const jsRegex = /\.js$/i;

class Client extends AkairoClient {
	constructor(options) {
		super(options);

		this.commandHandler = new CommandHandler(this, {
			directory: path.join(__dirname, '..', 'commands'),
			prefix: msg => msg.channel.type === 'text' ? options.prefix : '',
			aliasReplacement: /-/g,
			handleEdits: true,
			commandUtil: true,
			commandUtilLifetime: 60000,
			fetchMembers: true,
			defaultCooldown: 1000,
			defaultPrompt: {
				modifyStart: text => stripIndents`
					${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				modifyRetry: text => stripIndents`
					${text}
					Respond with \`cancel\` to cancel the command. The command will automatically be cancelled in 30 seconds.
				`,
				timeout: 'Cancelled command due to timeout.',
				ended: '2 tries and you still don\'t understand. Perhaps view this command\'s help information?',
				cancel: 'Cancelled command.',
				retries: 2
			}
		});
	}

	setup() {
		this.commandHandler.loadAll();
		const typePath = path.join(__dirname, '..', 'types');
		if (fs.existsSync(typePath)) {
			const typeFiles = fs.readdirSync(typePath);
			for (const file of typeFiles) {
				if (!jsRegex.test(file)) continue;
				const type = require(path.join(typePath, file));
				this.commandHandler.resolver.addType(type.id, type.exec.bind(type));
			}
		}
	}
}

module.exports = Client;
