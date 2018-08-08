const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { shuffle, verify } = require('../../util/Util');
const events = require('../../assets/json/hunger-games');

module.exports = class HungerGamesCommand extends Command {
	constructor() {
		super('hunger-games', {
			aliases: ['hunger-games', 'hunger-games-simulator', 'brant-steele'],
			category: 'games',
			description: {
				content: 'Simulate a Hunger Games match with up to 24 tributes.',
				usage: '<...tributes>'
			},
			args: [
				{
					id: 'tributes',
					prompt: {
						start: 'Who should compete in the games? Up to 24 tributes can participate.',
						retry: 'You provided an invalid tribute. Please try again.',
						infinite: true,
						limit: 24
					},
					match: 'separate',
					type: tribute => tribute && tribute.length < 21 ? tribute : null
				}
			]
		});

		this.playing = new Set();
	}

	async exec(msg, { tributes }) {
		if (tributes.length < 2) return msg.util.send(`...${tributes[0]} wins, as they were the only tribute.`);
		if (new Set(tributes).size !== tributes.length) {
			return msg.util.reply('Please do not enter the same tribute twice.');
		}
		if (this.playing.has(msg.channel.id)) return msg.util.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			let sun = true;
			let turn = 0;
			let bloodbath = true;
			const remaining = new Set(shuffle(tributes));
			while (remaining.size > 1) {
				if (!bloodbath && sun) ++turn;
				const sunEvents = bloodbath ? events.bloodbath : sun ? events.day : events.night;
				const results = [];
				const deaths = [];
				this.makeEvents(remaining, sunEvents, deaths, results);
				let text = stripIndents`
					__**${bloodbath ? 'Bloodbath' : sun ? `Day ${turn}` : `Night ${turn}`}**__:
					${results.join('\n')}
				`;
				if (deaths.length) {
					text += '\n\n';
					text += stripIndents`
						**${deaths.length} cannon shot${deaths.length === 1 ? '' : 's'} can be heard in the distance.**
						${deaths.join('\n')}
					`;
				}
				text += `\n\n_Proceed?_`;
				await msg.util.sendNew(text);
				const verification = await verify(msg.channel, msg.author, 120000);
				if (!verification) {
					this.playing.delete(msg.channel.id);
					return msg.util.sendNew('See you next time!');
				}
				if (!bloodbath) sun = !sun;
				if (bloodbath) bloodbath = false;
			}
			this.playing.delete(msg.channel.id);
			const remainingArr = Array.from(remaining);
			return msg.util.sendNew(`And the winner is... ${remainingArr[0]}!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			throw err;
		}
	}

	parseEvent(event, tributes) {
		return event
			.replace(/\(Player1\)/gi, `**${tributes[0]}**`)
			.replace(/\(Player2\)/gi, `**${tributes[1]}**`)
			.replace(/\(Player3\)/gi, `**${tributes[2]}**`)
			.replace(/\(Player4\)/gi, `**${tributes[3]}**`)
			.replace(/\(Player5\)/gi, `**${tributes[4]}**`)
			.replace(/\(Player6\)/gi, `**${tributes[5]}**`);
	}

	makeEvents(tributes, eventsArr, deaths, results) {
		const turn = new Set(tributes);
		for (const tribute of tributes) {
			if (!turn.has(tribute)) continue;
			const valid = eventsArr.filter(event => event.tributes <= turn.size && event.deaths < turn.size);
			const event = valid[Math.floor(Math.random() * valid.length)];
			turn.delete(tribute);
			if (event.tributes === 1) {
				if (event.deaths.length === 1) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				results.push(this.parseEvent(event.text, [tribute]));
			} else {
				const current = [tribute];
				if (event.deaths.includes(1)) {
					deaths.push(tribute);
					tributes.delete(tribute);
				}
				for (let i = 2; i <= event.tributes; i++) {
					const turnArr = Array.from(turn);
					const tribu = turnArr[Math.floor(Math.random() * turnArr.length)];
					if (event.deaths.includes(i)) {
						deaths.push(tribu);
						tributes.delete(tribu);
					}
					current.push(tribu);
					turn.delete(tribu);
				}
				results.push(this.parseEvent(event.text, current));
			}
		}
	}
};
