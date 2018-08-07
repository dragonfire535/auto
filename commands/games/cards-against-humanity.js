const Command = require('../../structures/Command');
const { Collection, escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');
const { shuffle, awaitPlayers } = require('../../util/Util');
const { blackCards, whiteCards } = require('../../assets/json/cards-against-humanity');

module.exports = class CardsAgainstHumanityCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cards-against-humanity',
			aliases: ['crude-cards', 'pretend-youre-xyzzy', 'cah'],
			group: 'games',
			memberName: 'cards-against-humanity',
			description: 'Compete to see who can come up with the best card to fill in the blank.',
			guildOnly: true,
			args: [
				{
					key: 'maxPts',
					label: 'maximum amount of points',
					prompt: 'What amount of points should determine the winner?',
					type: 'integer',
					min: 1,
					max: 20
				}
			]
		});

		this.playing = new Set();
	}

	async run(msg, { maxPts }) {
		if (this.playing.has(msg.channel.id)) return msg.reply('Only one game may be occurring per channel.');
		this.playing.add(msg.channel.id);
		try {
			await msg.say('You will need at least 2 more players, at maximum 10. To join, type `join game`.');
			const awaitedPlayers = await awaitPlayers(msg, 10, 3);
			if (!awaitedPlayers) {
				this.playing.delete(msg.channel.id);
				return msg.say('Game could not be started...');
			}
			const players = this.generatePlayers(awaitedPlayers);
			const czars = Array.from(players.values());
			let winner = null;
			while (!winner) {
				const czar = czars[0];
				czars.push(czar);
				czars.shift();
				const black = blackCards[Math.floor(Math.random() * blackCards.length)];
				await msg.say(stripIndents`
					The card czar will be ${czar.user}!
					The Black Card is: **${escapeMarkdown(black.text)}**

					Sending DMs...
				`);
				const chosenCards = [];
				const turns = players.map(async player => {
					if (player.hand.size < 11) {
						const valid = whiteCards.filter(card => !player.hand.has(card));
						player.hand.add(valid[Math.floor(Math.random() * valid.length)]);
					}
					if (player.user.id === czar.user.id) return;
					if (player.hand.size < black.pick) {
						await player.user.send('You don\'t have enough cards!');
						return;
					}
					const hand = Array.from(player.hand);
					await player.user.send(stripIndents`
						__**Your hand is**__:
						${hand.map((card, i) => `**${i + 1}.** ${card}`).join('\n')}

						**Black Card**: ${escapeMarkdown(black.text)}
						**Card Czar**: ${czar.user.username}
						Pick **${black.pick}** card${black.pick > 1 ? 's' : ''}!
					`);
					const chosen = [];
					const filter = res => {
						const existing = hand[Number.parseInt(res.content, 10) - 1];
						if (!existing) return false;
						if (chosen.includes(existing)) return false;
						chosen.push(existing);
						return true;
					};
					const choices = await player.user.dmChannel.awaitMessages(filter, {
						max: black.pick,
						time: 120000
					});
					if (!choices.size || choices.size < black.pick) {
						await player.user.send('Skipping your turn...');
						return;
					}
					if (chosen.includes('<Blank>')) {
						const handled = await this.handleBlank(player);
						chosen[chosen.indexOf('<Blank>')] = handled;
					}
					for (const card of chosen) player.hand.delete(card);
					chosenCards.push({
						id: player.id,
						cards: chosen
					});
					await player.user.send(`Nice! Return to ${msg.channel} to await the results!`);
				});
				await Promise.all(turns);
				if (!chosenCards.length) {
					await msg.say('Hmm... No one even tried.');
					break;
				}
				const cards = shuffle(chosenCards);
				await msg.say(stripIndents`
					${czar.user}, which card${black.pick > 1 ? 's' : ''} do you pick?
					**Black Card**: ${escapeMarkdown(black.text)}

					${cards.map((card, i) => `**${i + 1}.** ${card.cards.join(', ')}`).join('\n')}
				`);
				const filter = res => {
					if (res.author.id !== czar.user.id) return false;
					if (!cards[Number.parseInt(res.content, 10) - 1]) return false;
					return true;
				};
				const chosen = await msg.channel.awaitMessages(filter, {
					max: 1,
					time: 120000
				});
				if (!chosen.size) {
					await msg.say('Hmm... No one wins.');
					continue;
				}
				const player = players.get(cards[Number.parseInt(chosen.first().content, 10) - 1].id);
				++player.points;
				if (player.points >= maxPts) winner = player.user;
				else await msg.say(`Nice one, ${player.user}! You now have **${player.points}** points!`);
			}
			this.playing.delete(msg.channel.id);
			if (!winner) return msg.say('See you next time!');
			return msg.say(`And the winner is... ${winner}! Great job!`);
		} catch (err) {
			this.playing.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	generatePlayers(list) {
		const players = new Collection();
		for (const user of list) {
			const cards = new Set();
			for (let i = 0; i < 5; i++) {
				const valid = whiteCards.filter(card => !cards.has(card));
				cards.add(valid[Math.floor(Math.random() * valid.length)]);
			}
			players.set(user.id, {
				id: user.id,
				user,
				points: 0,
				hand: cards
			});
		}
		return players;
	}

	async handleBlank(player) {
		await player.user.send('What do you want the blank card to say? Must be 100 or less characters.');
		const blank = await player.user.dmChannel.awaitMessages(res => res.content.length <= 100, {
			max: 1,
			time: 120000
		});
		player.hand.delete('<Blank>');
		if (!blank.size) return `A blank card ${player.user.tag} forgot to fill out.`;
		return blank.first().content;
	}
};
