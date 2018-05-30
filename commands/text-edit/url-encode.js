const Command = require('../../structures/Command');

module.exports = class URLEncodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'url-encode',
			aliases: ['encode-url', 'encode-uri', 'uri-encode', 'encode-uri-component'],
			group: 'text-edit',
			memberName: 'url-encode',
			description: 'Encodes text to URL-friendly characters.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to encode?',
					type: 'string',
					validate: text => {
						if (encodeURIComponent(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(encodeURIComponent(text));
	}
};
