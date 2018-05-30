const { Command } = require('discord.js-commando');

class AutoCommand extends Command {
	constructor(client, info) {
		if (typeof info.argsPromptLimit === 'undefined') info.argsPromptLimit = 0;
		super(client, info);

		this.argsSingleQuotes = info.argsSingleQuotes || false;
		this.throttling = info.throttling || { usages: 1, duration: 2 };
	}
}

module.exports = AutoCommand;
