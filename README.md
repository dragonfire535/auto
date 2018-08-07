# IA
[![Build Status](https://travis-ci.org/dragonfire535/ia.svg?branch=master)](https://travis-ci.org/dragonfire535/ia)
[![Discord Server](https://discordapp.com/api/guilds/252317073814978561/embed.png)](https://discord.gg/sbMe32W)
[![Donate on Patreon](https://img.shields.io/badge/patreon-donate-orange.svg)](https://www.patreon.com/dragonfire535)
[![Donate on PayPal](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.me/dragonfire535)

> This bot is not available for invite.

IA is a Discord bot coded in JavaScript with
[discord.js](https://discord.js.org/) using the
[Akairo](https://github.com/1Computer1/discord-akairo) command framework. Its primary
function is to scan JS and JSON codeblocks for syntax errors, as well as getting
certain programming information from sites such as MDN and Stack Overflow. It is
used on the [official Discord.js server](https://discord.gg/bRCvFy9).

## Commands (22)
### Utility:

* **eval**: Executes JavaScript code.
* **changelog**: Responds with IA's latest 10 commits.
* **donate**: Responds with IA's donation links.
* **help**: Displays a list of available commands, or detailed information for a specific command.
* **info**: Responds with detailed bot information.
* **invite**: Responds with IA's invite links.
* **ping**: Checks the bot's ping to the Discord server.

### Lint:

* **lint-amber**: Lints code with eslint-config-amber rules.
* **lint-default**: Lints code with the recommended rules.
* **lint-json**: Lints JSON.
* **lint-rule**: Gets information on an eslint rule.

### Search:

* **github**: Responds with information on a GitHub repository.
* **http-cat**: Responds with a cat for an HTTP status code.
* **http-dog**: Responds with a dog for an HTTP status code.
* **mdn**: Searches MDN for your query.
* **npm**: Responds with information on an NPM package.
* **stack-overflow**: Searches Stack Overflow for your query.

### Games:
* **cards-against-humanity**: Compete to see who can come up with the best card to fill in the blank.
* **hunger-games**: Simulate a Hunger Games match with up to 24 tributes.

### Other:

* **beautify**: Beautifies code with js-beautify.
* **hastebin**: Posts code to hastebin.
* **hi**: Hello.

## Licensing
The bot is licensed under the GPL 3.0 license. See the file `LICENSE` for more
information. If you plan to use any part of this source code in your own bot, I
would be grateful if you would include some form of credit somewhere.
