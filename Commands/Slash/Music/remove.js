const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "remove",
  description: `remove a song from current queue`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,
  options: [
    {
      name: "trackindex",
      description: `give me song index`,
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    let existingChannelId = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let existingChannel = interaction.guild.channels.cache.get(existingChannelId);
    if (existingChannel && interaction.channelId === existingChannelId) {
      return interaction.followUp({
        content: `:rolling_eyes: **you can't use this command in this channel**`,
        ephemeral: true,
      });
    }
    if (existingChannel) {
      return interaction.followUp({
        content: `:rolling_eyes: **Music channel already setup in ${existingChannel}**`,
        ephemeral: true,
      });
    }
    // Code

    try {
      const songIndex = interaction.options.getNumber("trackindex");

      if (
        !songIndex ||
        isNaN(songIndex) ||
        songIndex < 1 ||
        songIndex > queue.songs.length
      ) {
        return client.embed(interaction, "Please provide a valid song index.");
      }

      let removedTrack = queue.songs.splice(songIndex - 1, 1)[0];
      if (!removedTrack) {
        return client.embed(
          interaction,
          "Failed to remove the track from the queue."
        );
      }

      client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Removed \`${client.getTitle(
          removedTrack
        )}\` From the Queue !!`
      );
    } catch (error) {
      console.error(error);
      client.embed(
        interaction,
        `${client.config.emoji.ERROR} An error occurred: ${error.message}`
      );
    }
  },
};
