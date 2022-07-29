Audio samples discord bot
=========================

A [Discord](https://discord.com/) bot that plays audio samples.

Getting started
---------------

Create your own bot on Discord ..... need "bot" and "application.commands" scopes .... need "voice" and "slash commands" permissions.... then:

1. git clone https://github.com/PhilboBaggins/audio-samples-discord-bot
2. Fill in variables into `.env` file
   1. DISCORD_TOKEN=??????????
   2. DISCORD_APP_ID=??????????
   3. DISCORD_GUILD_ID=??????????
3. Fill in paths to audio files into `audio-paths.js`
4. Run `node deploy-commands.js`
5. Run `node app.js`
