const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "playprevious",
  aliases: ["pp", "playp"],
  description: `play previous song of queue`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
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
    // Code
    if (!queue.previousSongs.length) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Previous Song Not Found !!`
      );
    } else {
      await queue.previous().then((m) => {
        client.embed(
          message,
          `${client.config.emoji.SUCCESS} Playing Previous Track !!`
        );
      });
    }
  },
};
