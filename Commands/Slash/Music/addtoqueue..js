const {
  ContextMenuInteraction,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "addtoqueue",
  type: ApplicationCommandType.Message,

  /**
   *
   * @param {JUGNU} client
   * @param {ContextMenuInteraction} interaction
   */
  run: async (client, interaction) => {
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
    let msg = await interaction.channel.messages.fetch(interaction.targetId);
    let song =
      msg.cleanContent || msg.embeds[0].description || msg.embeds[0].title;
    let voiceChannel = interaction.member.voice.channel;
    let botChannel = interaction.guild.members.me.voice.channel;
    if (!msg || !song) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} No Song found`
      );
    } else if (!voiceChannel) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} You Need to Join Voice Channel`
      );
    } else if (botChannel && !botChannel?.equals(voiceChannel)) {
      return client.embed(
        interaction,
        `${client.config.emoji.ERROR} You Need to Join ${botChannel} Voice Channel`
      );
    } else {
      client.distube.play(voiceChannel, song, {
        member: interaction.member,
        textChannel: interaction.channel,
      });
      return client.embed(
        interaction,
        `${client.config.emoji.SUCCESS} Searching \`${song}\` in Universe`
      );
    }
  },
};
