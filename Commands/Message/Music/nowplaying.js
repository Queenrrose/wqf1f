const { Message, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: `see what is playing now`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: true,
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
    let song = queue.songs[0];

    message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setThumbnail(song.thumbnail)
          .setAuthor({
            name: `Now Playing`,
            iconURL: song.thumbnail,
            url: song.url,
          })
          .setDescription(`** [${client.getTitle(song)}](${song.streamURL}) **`)
          .addFields([
            {
              name: `** Duration **`,
              value: ` \`${queue.formattedCurrentTime}/${song.formattedDuration} \``,
              inline: true,
            },
            {
              name: `** Requested By **`,
              value: ` \`${song.user.tag} \``,
              inline: true,
            },
            {
              name: `** Author **`,
              value: ` \`${song.uploader.name}\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
