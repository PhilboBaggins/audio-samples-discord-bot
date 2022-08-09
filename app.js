const { Client, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const audio = require('./audio.js');
const config = require('./config.json');

const player = createAudioPlayer();

player.on('error', (error) => {
  console.error(`Error with audio player: ${error.message} with resource ${error.resource.metadata.title}`);
});

//player.on('stateChange', (oldState, newState) => {
//  console.log(`Changing music player state from ${oldState.status} to ${newState.status}`);
//});

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
    await audio.playFromOption(interaction, player);
  } else if (interaction.isButton() && interaction.customId.startsWith('play:')) {
    await audio.playFromButton(interaction, player);
  } else {
    console.log(interaction.options);
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  const userJustLeftChannel = (oldState.channel !== null) && (newState.channel === null);
  const userJustMovedChannel = (oldState.channel !== null) && (newState.channel !== null);
  if (userJustLeftChannel || userJustMovedChannel) {
    const numNonBotMem = oldState.channel.members.filter(m => !m.user.bot).size;
    const iAmConnected = oldState.channel.members.has(config.DISCORD_APP_ID);
    if (iAmConnected && (numNonBotMem == 0)) {
      console.log('I am the only one left ... time to leave');
      getVoiceConnection(oldState.guild.id).disconnect();
    }
  }
});

client.login(config.DISCORD_TOKEN);
