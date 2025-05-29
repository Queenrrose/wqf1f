const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "config",
  aliases: ["cnf"],
  description: `see config of current server`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
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
    let existingChannelId = await client.music.get(
      `${message.guild.id}.music.channel`
    );
    let existingChannel = message.guild.channels.cache.get(existingChannelId);
    if (existingChannel) {
      if (existingChannel && message.channelId === existingChannelId) {
        return message.channel.send(
          `:rolling_eyes: **you can't use this command in this channel**`
        );
      }
    }
    // Code
    let data = await client.music.get(message.guild.id);

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setAuthor({
            name: `${message.guild.name} Config`,
            iconURL: message.guild.iconURL({ dynamic: true }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .addFields([
            {
              name: `Prefix`,
              value: `\`${prefix}\``,
            },
            {
              name: `DJ`,
              value: `${
                data.djrole
                  ? `${client.config.emoji.SUCCESS} \`Enabled\``
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
            {
              name: `Autoresume`,
              value: `${
                data.autoresume
                  ? `${client.config.emoji.SUCCESS} \`Enabled\``
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
            {
              name: `24/7`,
              value: `${
                data.vc.enable
                  ? `${client.config.emoji.SUCCESS} \`Enabled\``
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
            {
              name: `Request Channel`,
              value: `${
                data.music.channel
                  ? `<#${data.music.channel}>`
                  : `${client.config.emoji.ERROR}  \`Disabled\``
              }`,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
