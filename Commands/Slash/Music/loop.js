const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  description: `toggle loop song/queue/off system`,
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
      name: "loopmode",
      description: `choose loop mode`,
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Track",
          value: `1`,
        },
        {
          name: "Queue",
          value: `2`,
        },
        {
          name: "Off",
          value: `0`,
        },
      ],
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
    let loopmode = Number(interaction.options.getString("loopmode"));
    await queue.setRepeatMode(loopmode);
    if (queue.repeatMode === 0) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Loop Disabled!! **`
      );
    } else if (queue.repeatMode === 1) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Song Loop Enabled!! **`
      );
    } else if (queue.repeatMode === 2) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.SUCCESS} Queue Loop Enabled!! **`
      );
    }
  },
};
