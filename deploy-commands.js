
require('dotenv').config();

const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('tracks').setDescription('Show track list'),
  new SlashCommandBuilder().setName('track-buttons').setDescription('Show track buttons'),
  new SlashCommandBuilder()
	.setName('play')
	.setDescription('Play audio track')
  .addIntegerOption(option =>
		option.setName('track-num')
			.setDescription('The track number to play')
			.setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, process.env.DISCORD_GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
