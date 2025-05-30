const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "autoresume",
  aliases: ["atresume"],
  description: `toggle autoresume system on/off`,
  userPermissions: PermissionFlagsBits.ManageGuild,
  botPermissions: PermissionFlagsBits.ManageGuild,
  category: "Settings",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: true,
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
    let data = await client.music.get(`${message.guild.id}.autoresume`);
    if (data === true) {
      await client.music.set(`${message.guild.id}.autoresume`, false);
      client.embed(
        message,
        `** ${client.config.emoji.ERROR} Autoresume System Disabled **`
      );
    } else {
      await client.music.set(`${message.guild.id}.autoresume`, true);
      client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} Autoresume System Enabled **`
      );
    }
  },
};
