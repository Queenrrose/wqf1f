const { Message, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "setupmusic",
  aliases: ["setmusic", "setup"],
  description: `setup music channel in server`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
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
    // Code
    let channel = await client.music.get(`${message.guild.id}.music.channel`);
    let oldChannel = message.guild.channels.cache.get(channel);
    if (oldChannel) {
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} Music Request Channel already Setup in ${oldChannel} Delete first and Setup Again **`
      );
    } else {

      message.guild.channels
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
              id: message.guild.id,
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
            .send({ embeds: [client.queueembed(message.guild)] })
            .then(async (queuemsg) => {
              await ch
                .send({
                  embeds: [client.playembed(message.guild)],
                  components: [ss, client.buttons(true), client.buttons1(true), client.buttons2(true),],
                })
                .then(async (playmsg) => {
                  await client.music.set(`${message.guild.id}.music`, {
                    channel: ch.id,
                    pmsg: playmsg.id,
                    qmsg: queuemsg.id,
                  });
                  client.embed(
                    message,
                    `${client.config.emoji.SUCCESS} Successfully Setup Music System in ${ch}`
                  );
                });
            });
        });
    }
  },
};
