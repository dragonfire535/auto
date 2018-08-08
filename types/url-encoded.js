const { Type } = require('discord-akairo');

module.exports = Type.create('url-encoded', phrase => {
	if (!phrase) return null;
	return encodeURIComponent(phrase);
});
