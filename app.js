const { Client, GatewayIntentBits } = require('discord.js');
const audio = require('./audio.js');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
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
    console.log(interaction.options);
  }
});

client.login(config.DISCORD_TOKEN);
