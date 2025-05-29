const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "clearqueue",
  description: `clear current queue in server`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

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
    queue.remove();
    client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} Queue Cleared !!`
    );
  },
};
