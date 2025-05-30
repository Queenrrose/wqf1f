const {
  CommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  ApplicationCommandType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  description: `setup music channel in server`,
  userPermissions: PermissionFlagsBits.ManageChannels,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Settings",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
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
    let s = new StringSelectMenuBuilder()
      .setCustomId("music")
      .setPlaceholder("Suggestion Track")
      .setDisabled(true)
      .addOptions([
        {
          label: "Music",
          description: "Music",
          value: "7",
        },
      ])

    let ss = new ActionRowBuilder().addComponents(s)
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
    let channel = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let oldChannel = interaction.guild.channels.cache.get(channel);

    if (oldChannel) {
      return client.embed(
        interaction,
        `** ${client.config.emoji.ERROR} Music Request Channel already Setup in ${oldChannel} Delete first and Setup Again **`
      );
    } else {
      interaction.guild.channels
        .create({
          name: `${client.user.username}-requests`,
          type: ChannelType.GuildText,
          rateLimitPerUser: 3,
          reason: `Management of music requests channel.`,
          topic: `Music Request Channel for ${client.user.username}. Please submit song names or links to play music.`,
          permissionOverwrites: [
            {
              id: client.user.id,
              allow: [
                "ManageMessages",
                "ManageChannels",
                "SendMessages",
                "EmbedLinks",
                "ReadMessageHistory",
                "UseExternalEmojis",
                "ViewChannel",
              ],
            },
            {
              id: interaction.guild.id,
              allow: [
                "SendMessages",
                "EmbedLinks",
                "ReadMessageHistory",
                "ViewChannel",
              ],
            }
          ],
        })
        .then(async (ch) => {
          await ch
            .send({ embeds: [client.queueembed(interaction.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(interaction.guild)],
                  components: [ss, client.buttons(true), client.buttons1(true), client.buttons2(true),],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${interaction.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    interaction,
                    `${client.config.emoji.SUCCESS} Successfully Setup Music System in ${ch}`
                  );
                });
            });
        });
    }
  },
};
