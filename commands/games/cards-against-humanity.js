const { Command, Argument } = require('discord-akairo');
const { Collection, escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, awaitPlayers } = require('../../util/Util');
const { blackCards, whiteCards } = require('../../assets/json/cards-against-humanity');
const { SUCCESS_EMOJI_ID, FAILURE_EMOJI_ID } = process.env;

module.exports = class CardsAgainstHumanityCommand extends Command {
	constructor() {
		super('cards-against-humanity', {
			aliases: ['cards-against-humanity', 'crude-cards', 'pretend-youre-xyzzy', 'cah'],
			category: 'games',
			description: 'Compete to see who can come up with the best card to fill in the blank.',
			channel: 'guild',
			clientPermissions: ['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'],
			args: [
				{
					id: 'maxPts',
					prompt: {
						start: 'What amount of points should determine the winner?',
						retry: 'You provided an invalid points maximum. Please try again.'
					},
					type: Argument.range('integer', 1, 20, true)
				},
				{
					id: 'noMidJoin',
					match: 'flag',
					flag: ['--no-mid-join', '-nmj']
				}
			]
		});

		this.playing = new Set();
	}

	async exec(msg, { maxPts, noMidJoin }) { // eslint-disable-line complexity
		if (this.playing.has(msg.channel.id)) return msg.util.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		let joinLeaveCollector = null;
		let pointViewCollector = null;
		try {
			await msg.util.sendNew('You will need at least 2 more players, at maximum 10. To join, type `join game`.');
			const awaitedPlayers = await awaitPlayers(msg, 10, 3);
			if (!awaitedPlayers) {
				this.playing.delete(msg.channel.id);
				return msg.util.sendNew('Game could not be started...');
			}
			const players = new Collection();
			for (const user of awaitedPlayers) this.generatePlayer(user, players);
			const czars = players.map(player => player.id);
			let winner = null;
			if (!noMidJoin) joinLeaveCollector = this.createJoinLeaveCollector(msg.channel, players, czars);
			pointViewCollector = this.createPointViewCollector(msg.channel, players);
			while (!winner) {
				for (const player of players) {
					if (player.strikes >= 3) this.kickPlayer(player, players, czars);
				}
				if (players.size < 3) {
					await msg.util.sendNew('Oh... It looks like everyone left...');
					break;
				}
				const czar = players.get(czars[0]);
				czars.push(czar.id);
				czars.shift();
				const black = blackCards[Math.floor(Math.random() * blackCards.length)];
				await msg.util.sendNew(stripIndents`
					The card czar will be ${czar.user}!
					The Black Card is: **${escapeMarkdown(black.text)}**

					Sending DMs...
				`);
				const chosenCards = [];
				await Promise.all(players.map(player => this.playerTurn(player, czar, black, msg.channel, chosenCards)));
				if (!chosenCards.length) {
					await msg.util.sendNew('Hmm... No one even tried.');
					continue;
				}
				const cards = shuffle(chosenCards);
				await msg.util.sendNew(stripIndents`
					${czar.user}, which card${black.pick > 1 ? 's' : ''} do you pick?
					**Black Card**: ${escapeMarkdown(black.text)}

					${cards.map((card, i) => `**${i + 1}.** ${card.cards.join(', ')}`).join('\n')}
				`);
				const filter = res => {
					if (res.author.id !== czar.user.id) return false;
					if (!/^[0-9]+$/g.test(res.content)) return false;
					if (!cards[Number.parseInt(res.content, 10) - 1]) return false;
					return true;
				};
				const chosen = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 120000
				});
				if (!chosen.size) {
					await msg.util.sendNew('Hmm... No one wins. Dealing back cards...');
					for (const pick of cards) {
						for (const card of pick.cards) players.get(pick.id).hand.add(card);
					}
					players.get(czar.id).strikes++;
					continue;
				}
				const player = players.get(cards[Number.parseInt(chosen.first().content, 10) - 1].id);
				if (!player) {
					await msg.util.sendNew('Oh no, I think that player left! No points will be awarded...');
					continue;
				}
				++player.points;
				if (player.points >= maxPts) {
					winner = player.user;
				} else {
					const addS = player.points > 1 ? 's' : '';
					await msg.util.sendNew(`Nice, ${player.user}! You now have **${player.points}** point${addS}!`);
				}
			}
			if (joinLeaveCollector) joinLeaveCollector.stop();
			pointViewCollector.stop();
			this.playing.delete(msg.channel.id);
			if (!winner) return msg.util.sendNew('See you next time!');
			return msg.util.sendNew(`And the winner is... ${winner}! Great job!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			if (joinLeaveCollector) joinLeaveCollector.stop();
			if (pointViewCollector) pointViewCollector.stop();
			return msg.util.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	generatePlayer(user, players) {
		const cards = new Set();
		for (let i = 0; i < 10; i++) {
			const valid = whiteCards.filter(card => !cards.has(card));
			cards.add(valid[Math.floor(Math.random() * valid.length)]);
		}
		players.set(user.id, {
			id: user.id,
			user,
			points: 0,
			hand: cards,
			strikes: 0
		});
		return players;
	}

	async playerTurn(player, czar, black, channel, chosenCards) {
		if (player.user.id === czar.user.id) return;
		if (player.hand.size < 10) {
			const valid = whiteCards.filter(card => !player.hand.has(card));
			player.hand.add(valid[Math.floor(Math.random() * valid.length)]);
		}
		try {
			if (player.hand.size < black.pick) {
				await player.user.send('You don\'t have enough cards!');
				return;
			}
			const hand = Array.from(player.hand);
			await player.user.send(stripIndents`
				__**Your hand is**__: _(Type \`swap\` to exchange a point for a new hand.)_
				${hand.map((card, i) => `**${i + 1}.** ${card}`).join('\n')}

				**Black Card**: ${escapeMarkdown(black.text)}
				**Card Czar**: ${czar.user.username}
				Pick **${black.pick}** card${black.pick > 1 ? 's' : ''}!
			`);
			const chosen = [];
			const filter = res => {
				if (res.content.toLowerCase() === 'swap' && player.points > 0) return true;
				const existing = hand[Number.parseInt(res.content, 10) - 1];
				if (!existing) return false;
				if (chosen.includes(existing)) return false;
				chosen.push(existing);
				return true;
			};
			const choices = await player.user.dmChannel.awaitMessages(filter, {
				max: black.pick,
				time: 60000
			});
			if (choices.first().content.toLowerCase() === 'swap') {
				player.points--;
				await player.user.send('Swapping cards...');
				for (const card of player.hand) player.hand.delete(card);
				for (let i = 0; i < 10; i++) {
					const valid = whiteCards.filter(card => !player.hand.has(card));
					player.hand.add(valid[Math.floor(Math.random() * valid.length)]);
				}
				return this.playerTurn(player, czar, black, channel, chosenCards); // eslint-disable-line consistent-return
			}
			if (choices.size < black.pick) {
				for (let i = 0; i < black.pick; i++) chosen.push(hand[Math.floor(Math.random() * hand.length)]);
				player.strikes++;
			}
			if (chosen.includes('<Blank>')) {
				if (choices.size < black.pick) {
					const handled = await this.handleBlank(player);
					chosen[chosen.indexOf('<Blank>')] = handled;
				} else {
					chosen[chosen.indexOf('<Blank>')] = 'A randomly chosen blank card.';
				}
			}
			for (const card of chosen) player.hand.delete(card);
			chosenCards.push({
				id: player.id,
				cards: chosen
			});
			await player.user.send(`Nice! Return to ${channel} to await the results!`);
		} catch (err) {
			return; // eslint-disable-line no-useless-return
		}
	}

	async handleBlank(player) {
		await player.user.send('What do you want the blank card to say? Must be 100 or less characters.');
		const blank = await player.user.dmChannel.awaitMessages(res => res.content.length <= 100, {
			max: 1,
			time: 60000
		});
		player.hand.delete('<Blank>');
		if (!blank.size) return `A blank card ${player.user.tag} forgot to fill out.`;
		return blank.first().content;
	}

	createJoinLeaveCollector(channel, players, czars) {
		const filter = res => {
			if (res.author.bot) return false;
			if (players.has(res.author.id) && res.content.toLowerCase() !== 'leave game') return false;
			if (czars[0] === res.author.id || players.size >= 10) {
				res.react(FAILURE_EMOJI_ID || '❌').catch(() => null);
				return false;
			}
			if (!['join game', 'leave game'].includes(res.content.toLowerCase())) return false;
			res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
			return true;
		};
		const collector = channel.createMessageCollector(filter);
		collector.on('collect', msg => {
			if (msg.content.toLowerCase() === 'join game') {
				this.generatePlayer(msg.author, players);
				czars.push(msg.author.id);
			} else if (msg.content.toLowerCase() === 'leave game') {
				this.kickPlayer(msg.author, players, czars);
			}
		});
		return collector;
	}

	createPointViewCollector(channel, players) {
		const collector = channel.createMessageCollector(res => {
			if (res.author.bot) return false;
			if (!players.has(res.author.id)) return false;
			if (res.content.toLowerCase() !== 'view points') return false;
			return true;
		});
		collector.on('collect', msg => {
			const player = players.get(msg.author.id);
			msg.reply(`You have **${player.points}** point${player.points > 1 ? 's' : ''}.`).catch(() => null);
		});
		return collector;
	}

	kickPlayer(player, players, czars) {
		players.delete(player.id);
		czars.splice(czars.indexOf(player.id), 1);
	}
};
