const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const {
  createAudioPlayer,
  createAudioResource,
  entersState,
  generateDependencyReport,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

const CHANNEL_ID = '696242550163374100'; // 'General' voice channel 'Colonial Cannibalism Union' server
const AUDIO_FILE_PATHS = require('./audio-paths.js');





// TODO: Move this to util.js or something like that
function baseName(path) {
  return path.split('/').reverse()[0];
}

// TODO: There has got to be a better way to do this.... Javascript can't be this shit
// TODO: Move this to util.js or something like that
function formatInteger(length, num) {
  return String(num).padStart(length, '0');
}

// TODO: Move this to util.js or something like that
function getIntegerLength(num) {
  const str = `${num}`;
  return str.length;
}

// TODO: Move this to util.js or something like that
function justFileName(path) {
  fileNameWithExt = baseName(path);
  return fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.')) || fileNameWithExt;
}

// TODO: Move this to util.js or something like that
// https://stackoverflow.com/a/26230409
function partition(array, n) {
  return array.length ? [array.splice(0, n)].concat(partition(array, n)) : [];
}






const player = createAudioPlayer();
player.on('error', (error) => {
  console.error(`Error with audio player: ${error.message} with resource ${error.resource.metadata.title}`);
});
player.on('stateChange', (oldState, newState) => {
  //console.log(`Changing music player state from ${oldState.status} to ${newState.status}`);
});






async function trackList(interaction) {
  const formatLength = getIntegerLength(AUDIO_FILE_PATHS.length);
  let response = '## Track list\n';
  for (let index = 0; index < AUDIO_FILE_PATHS.length; index++) {
    const path = AUDIO_FILE_PATHS[index];
    response = response + `${formatInteger(formatLength, index)}: ${justFileName(path)}\n`;
  }
  await interaction.reply(response);
};

function makeButtonRow(buttons) {
  const row = new ActionRowBuilder();
  for (let index = 0; index < buttons.length; index++) {
    row.addComponents(buttons[index]);
  }
  return row;
}

async function trackButtons(interaction) {
  const buttons = AUDIO_FILE_PATHS.map((path, index) => {
    return new ButtonBuilder()
					.setCustomId('play:' + index)
					.setLabel(justFileName(path))
					.setStyle(ButtonStyle.Primary);
  });

  // Discord limits the number of buttons per row and the number of rows per message... so lets respect that
  const numButtonsPerRow = 5;
  const numRowsPermessage = 5;
  const partitionedButtons = partition(partition(buttons, numButtonsPerRow), numRowsPermessage);

  // Send first block of buttons as a reply
  const firstMessageButtons = partitionedButtons[0].map(makeButtonRow);
  await interaction.reply({ content: 'Audio tracks', components: firstMessageButtons });

  // Send addition blocks of buttons as a follow up
  for (let index = 1; index < partitionedButtons.length; index++) {
    const laterMessageButtons = partitionedButtons[index].map(makeButtonRow);
    await interaction.followUp({ content: 'More audio tracks', components: laterMessageButtons });
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
  if (interaction.member.voice.channel) {
    // Join the same voice channel as the user who issued the command
    const channel = interaction.member.voice.channel;
    const voiceChannelConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
  
    // and subscribe that channel to receive data from the audio player
    voiceChannelConnection.subscribe(player);
  } else {
    await interaction.reply({ content: 'Join a voice channel then try again!', ephemeral: true  });
    return;
  }

  // ...........................................................................
  const track = AUDIO_FILE_PATHS[trackNum % AUDIO_FILE_PATHS.length];
  const trackName = justFileName(track);

  // Play the requested audio file
  let resource = createAudioResource(track);
  player.play(resource);

  console.log(`${interaction.member.user.username} is playing ${trackName}`);
  interaction.reply({ content: `Playing ${trackName}`, ephemeral: true });
};

module.exports = {
  trackList: trackList,
  trackButtons: trackButtons,
  playFromButton: playFromButton,
  playFromOption: playFromOption,
};
