const { Message, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "loop",
  aliases: ["lp", "lop"],
  description: `toggle queue/song/off repeat mode`,
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
    let loopmode = args[0];
    let mods = ["song", "s", "queue", "q", "off"];
    if (!mods.includes(loopmode)) {
      return client.embed(
        message,
        `Wrong Usage :: \`\`\`${mods.join(" ' ")}\`\`\``
      );
    }
    if (loopmode === "off") {
      await queue.setRepeatMode(0);
      return client.embed(
        message,
        `** ${client.config.emoji.ERROR} Loop Disabled!! **`
      );
    } else if (loopmode === "song" || loopmode === "s") {
      await queue.setRepeatMode(1);
      return client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} Song Loop Enabled!! **`
      );
    } else if (loopmode === "queue" || loopmode === "q") {
      await queue.setRepeatMode(2);
      return client.embed(
        message,
        `** ${client.config.emoji.SUCCESS} Queue Loop Enabled!! **`
      );
    }
  },
};
