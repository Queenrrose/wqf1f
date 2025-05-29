const { Message, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "leave",
  aliases: ["disconnect", "dc"],
  description: `Avon leaves the voice channel`,
  userPermissions: PermissionFlagsBits.ManageGuild,
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
      if (!message.member.voice.channel) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `You need to be in a voice channel to use this command`,
            iconURL: message.author.displayAvatarURL(),
          })
          .setColor(client.config.color);
        return message.channel
          .send({
            embeds: [embed],
          })
          .then((x) => {
            setTimeout(() => x.delete(), 5000);
          });
      }

      // قطع الاتصال من القناة الصوتية
      await client.distube.voices.leave(message.guild);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Left the voice channel`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setColor(client.config.color);
      message.channel.send({ embeds: [embed] });
    } catch (e) {
      console.error("An error occurred while running the leave command:", e);
      message.channel.send(
        `${client.config.emoji.ERROR} An error occurred while processing your request.`
      );
    }
  },
};