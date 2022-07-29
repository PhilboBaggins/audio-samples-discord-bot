Audio samples discord bot
=========================

A [Discord](https://discord.com/) bot that plays audio samples.

Getting started
---------------

Create your own bot on Discord ..... need "bot" and "application.commands" scopes .... need "voice" and "slash commands" permissions.... then:

1. Run `git clone https://github.com/PhilboBaggins/audio-samples-discord-bot`
2. Run `npm install`
3. Fill in variables into `.env` file
   1. DISCORD_TOKEN=??????????
   2. DISCORD_APP_ID=??????????
   3. DISCORD_GUILD_ID=??????????
4. Fill in paths to audio files into `audio-paths.js`
5. Run `node deploy-commands.js`
6. Run `node app.js`
