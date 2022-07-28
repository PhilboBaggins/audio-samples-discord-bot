const { Client, GatewayIntentBits } = require('discord.js');
const audio = require('./audio.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	//if (!interaction.isChatInputCommand())
  //  return;

  const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	} else if (commandName === 'tracks') {
		await  audio.trackList(interaction);
	} else if (commandName === 'track-buttons') {
		await  audio.trackButtons(interaction);
	} else if (commandName === 'play') {
		await audio.playFromOption(interaction);
  } else if (interaction.isButton() && interaction.customId.startsWith('play:')) {
    await audio.playFromButton(interaction);
  } else {
    //console.dir(interaction);
    console.log(interaction.options);
  }
});

client.login(process.env.DISCORD_TOKEN);
