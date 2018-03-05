# Auto

> Note: The bot is not available for invite.

Auto is a Discord bot coded in JavaScript with
[discord.js](https://discord.js.org/) using the
[Commando](https://github.com/discordjs/Commando) command framework. Its primary
function is to scan JS and JSON codeblocks for syntax errors, as well as getting
certain programming information from sites such as MDN and Stack Overflow. It is
used on the [official Discord.js server](https://discord.gg/bRCvFy9).

## Commands (27)
### Utility:

* **eval**: Executes JavaScript code.
* **donate**: Responds with Auto's donation links.
* **help**: Displays a list of available commands, or detailed information for a specific command.
* **info**: Responds with detailed bot information.
* **ping**: Checks the bot's ping to the Discord server.
* **uptime**: Responds with how long the bot has been active.

### Lint:

* **lint-aqua**: Lints code with eslint-config-aqua rules.
* **lint-default**: Lints code with the recommended rules.
* **lint-json**: Lints JSON.
* **lint-rule**: Gets information on an eslint rule.

### Search:

* **github**: Responds with information on a GitHub repository.
* **http-cat**: Responds with a cat for an HTTP status code.
* **mdn**: Searches MDN for your query.
* **npm**: Responds with information on an NPM package.
* **spoopy-link**: Determines if a link is spoopy or not.
* **stack-overflow**: Searches Stack Overflow for your query.

### Text Manipulation:

* **base64**: Converts text to Base64.
* **hex**: Converts text to hex.
* **md5**: Creates a hash of text with the MD5 algorithm.
* **sha-256**: Creates a hash of text with the SHA-256 algorithm.
* **shorten-url**: Creates a goo.gl short URL from another URL.
* **url-encode**: Encodes text to URL-friendly characters.

### Other:

* **beautify**: Beautifies code with js-beautify.
* **hastebin**: Posts code to hastebin.
* **id**: Responds with a user's ID.
* **strawpoll**: Generates a Strawpoll with the options you provide.
* **toxicity**: Determines the toxicity of text.

## Licensing
The bot is licensed under the GPL 3.0 license. See the file `LICENSE` for more
information. If you plan to use any part of this source code in your own bot, I
would be grateful if you would include some form of credit somewhere.
