const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  description: `change volume of current queue`,
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
    let volume = Number(args[0]);
    if (!volume) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Please Provide Volume %`
      );
    } else if (volume > 250) {
      return client.embed(
        message,
        `${client.config.emoji.ERROR} Provide Volume Amount Between 1 - 250  !!`
      );
    } else {
      await queue.setVolume(volume);
      client.embed(
        message,
        `${client.config.emoji.SUCCESS} Volume Set to ${queue.volume}% !!`
      );
    }
  },
};
