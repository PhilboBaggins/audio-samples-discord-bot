const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require('@discordjs/voice');
const {
  formatInteger,
  getIntegerLength,
  justFileName,
  partition,
} = require('./util.js');
const config = require('./config.json');

async function trackList(interaction) {
  const formatLength = getIntegerLength(config.AUDIO_FILE_PATHS.length);
  let response = '## Track list\n';
  for (let index = 0; index < config.AUDIO_FILE_PATHS.length; index++) {
    const path = config.AUDIO_FILE_PATHS[index];
    response = response + `${formatInteger(formatLength, index)}: ${justFileName(path)}\n`;
  }
  await interaction.reply({ content: response, ephemeral: true });
}

function makeButtonRow(buttons) {
  const row = new ActionRowBuilder();
  for (let index = 0; index < buttons.length; index++) {
    row.addComponents(buttons[index]);
  }
  return row;
}

function makeButton(path, index) {
    return new ButtonBuilder()
          .setCustomId('play:' + index)
          .setLabel(justFileName(path))
          .setStyle(ButtonStyle.Primary);
}

async function trackButtons(interaction) {
  const buttons = config.AUDIO_FILE_PATHS.map(makeButton);

  // Discord limits the number of buttons per row and the number of rows per message... so lets respect that
  const numButtonsPerRow = 5;
  const numRowsPermessage = 5;
  const partitionedButtons = partition(partition(buttons, numButtonsPerRow), numRowsPermessage);

  // Send first block of buttons as a reply
  const firstMessageButtons = partitionedButtons[0].map(makeButtonRow);
  await interaction.reply({ content: 'Audio tracks', components: firstMessageButtons, ephemeral: true });

  // Send addition blocks of buttons as a follow up
  for (let index = 1; index < partitionedButtons.length; index++) {
    const laterMessageButtons = partitionedButtons[index].map(makeButtonRow);
    await interaction.followUp({ content: 'More audio tracks', components: laterMessageButtons, ephemeral: true });
  }
}

async function playFromButton(interaction) {
  const trackNum = interaction.customId.split(':')[1];
  return _play(interaction, trackNum);
}

async function playFromOption(interaction) {
  const trackNum = interaction.options.getInteger('track-num');
  return _play(interaction, trackNum);
}

async function _play(interaction, trackNum) {
  if (!interaction.member.voice.channel) {
    await interaction.reply({ content: 'Join a voice channel then try again!', ephemeral: true  });
    return;
  }

  // Join the same voice channel as the user who issued the command
  const channel = interaction.member.voice.channel;
  const voiceChannelConnection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  // Get the existing audio player for this channel or create a new one
  let player;
  if (voiceChannelConnection.state && voiceChannelConnection.state.subscription && voiceChannelConnection.state.subscription.player) {
    player = voiceChannelConnection.state.subscription.player;
  } else {
    player = createAudioPlayer();
    voiceChannelConnection.subscribe(player);
  }

  // ...........................................................................
  const trackPath = config.AUDIO_FILE_PATHS[trackNum % config.AUDIO_FILE_PATHS.length];
  const trackName = justFileName(trackPath);

  // Play the requested audio file
  let resource = createAudioResource(trackPath);
  player.play(resource);

  if (interaction.isButton()) {
    interaction.deferUpdate();
  } else {
    const replayButton = makeButtonRow([
      makeButton(trackPath, trackNum)
    ]);

    interaction.reply({ content: `Playing ${trackName}`, components: [replayButton], ephemeral: true });
  }
  console.log(`${interaction.member.user.username} is playing ${trackName}`);
}

module.exports = {
  trackList: trackList,
  trackButtons: trackButtons,
  playFromButton: playFromButton,
  playFromOption: playFromOption,
};
