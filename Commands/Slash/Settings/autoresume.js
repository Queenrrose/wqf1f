const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "autoresume",
  description: `setup autoresume in your server`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,

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
    // Code
    let data = await client.music.get(`${interaction.guild.id}.autoresume`);
    if (data === true) {
      await client.music.set(`${interaction.guild.id}.autoresume`, false);
      client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Autoresume System Disabled **`
      );
    } else {
      await client.music.set(`${interaction.guild.id}.autoresume`, true);
      client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Autoresume System Enabled **`
      );
    }
  },
};
