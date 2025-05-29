const {
  CommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "filter",
  description: `set filters in current queue`,
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
    const filters = Object.keys(client.config.filters);

    const row = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("filter-menu")
        .setPlaceholder("Click To Select Filter ..")
        .addOptions(
          [
            {
              label: `Off`,
              description: `Click to Disable Filter`,
              value: "off",
            },
            filters
              .filter((_, index) => index <= 22)
              .map((value) => {
                return {
                  label: value.toLocaleUpperCase(),
                  description: `Click to Set ${value} Filter`,
                  value: value,
                };
              }),
          ].flat(Infinity)
        ),
    ]);

    let msg = await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle(`Select To Enable Filters ...`)
          .setFooter(client.getFooter(interaction.user))
          .setDescription(
            `> Click on below dropdown Menu and Select a Filter To Add Filter in Queue !!`
          ),
      ],
      components: [row],
      fetchReply: true,
    });
  
  },
};
