const { Command } = require('discord.js-commando');
const vm = require('vm');

module.exports = class SafeEvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'safe-eval',
			aliases: ['vm'],
			group: 'other',
			memberName: 'safe-eval',
			description: 'Executes JavaScript code in a sandbox.',
			clientPermissions: ['READ_MESSAGE_HISTORY'],
			args: [
				{
					key: 'code',
					prompt: 'What code would you like to evaluate?',
					type: 'code'
				}
			]
		});
	}

	run(msg, { code }) {
		if (code.lang && !['js', 'javascript'].includes(code.lang)) {
			return msg.reply('Only `js` or `javascript` codeblocks should be run with this command.');
		}
		try {
			const ctx = vm.createContext(Object.create(null));
			const evaled = vm.runInContext(code.code, ctx, { timeout: 1000 });
			return msg.code('js', evaled);
		} catch (err) {
			return msg.reply(`Error while evaluating: \`${err.name}: ${err.message}\``);
		}
	}
};
