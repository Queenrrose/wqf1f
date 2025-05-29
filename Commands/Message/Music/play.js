const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "play",
  aliases: ["p", "song"],
  description: `play your fav by Name/Link`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: true,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    try {
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
        if (message.channelId !== existingChannelId) {
          return message.channel.send(
            `:rolling_eyes: **You can't use this command in this channel. Use ${existingChannel}.**`
          );
        }
      }

      const song = args.join(" ");
      if (!song) {
        return client.embed(
          message,
          `${client.config.emoji.ERROR} Please provide a song name or link.`
        );
      }

      // تشغيل الأغنية
      const { channel } = message.member.voice;
      await client.distube.play(channel, song, {
        member: message.member,
        textChannel: message.channel,
        message: message,
      });

      // حذف رسالة الأمر (اختياري)
      await message.delete().catch(() => { });
    } catch (err) {
      console.error("An error occurred while running the play command:", err);
      message.channel.send(
        `${client.config.emoji.ERROR} An error occurred while processing your request.`
      );
    }
  },
};
