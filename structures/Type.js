const { AkairoModule, AkairoError } = require('discord-akairo');

class Type extends AkairoModule {
	constructor(id, { category } = {}) {
		super(id, { category });
	}

	exec() {
		throw new AkairoError('NOT_IMPLEMENTED', this.constructor.name, 'exec');
	}
}

module.exports = Type;
