const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { swap_pages } = require("../../../handlers/functions");

module.exports = {
  name: "queue",
  description: `see current queue with pagination`,
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
    // Code
        if (!queue.songs.length) {
          return client.embed(
            interaction,
            `${client.config.emoji.ERROR} Nothing in Queue`
          );
        }
        if (queue.songs.length === 1) {
          const currentSong = queue.songs[0];
          const e = new EmbedBuilder()
            .setAuthor({ name: queue.textChannel.guild.name, iconURL: queue.textChannel.guild.iconURL() })
            .setDescription(`**\`0.\` __CURRENT TRACK__ \n${currentSong.name}\n ${client.config.emoji.arrow} ${currentSong.user.globalName || currentSong.user.username} - (\`${currentSong.formattedDuration}\`)**`)
            .setColor(client.config.embed.color);
          let btn = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("a")
              .setDisabled(true)
             .setEmoji(client.config.emoji.leftarrow),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("1s")
              .setDisabled(true)
              .setEmoji(client.config.emoji.singilleftarrow),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Danger)
              .setCustomId("2f")
              .setDisabled(true)
              .setLabel("⛔️"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("3gv")
              .setDisabled(true)
              .setEmoji(client.config.emoji.singilrightarrow),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setCustomId("4v")
              .setDisabled(true)
              .setEmoji(client.config.emoji.rightarrow),
          ]);
    
          return interaction.followUp({ embeds: [e] , components: [btn] });
    } else {
      let embeds = await client.getQueueEmbeds(queue);
      await swap_pages(interaction, embeds);
    }
  },
};
