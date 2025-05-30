const {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { numberEmojis } = require("../../../settings/config");

module.exports = {
  name: "search",
  aliases: ["sr", "find"],
  description: `search a song by name`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  inVoiceChannel: true,
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
      if (message.channelId !== existingChannelId) {
        return message.channel.send(
          `:rolling_eyes: **You can't use this command in this channel. Use ${existingChannel}.**`
        );
      }
    }
    // Code
    let query = args.join(" ");
    if (!query) {
      return client.embed(message, `Please Provide Song Name to Search`);
    }

    let res = await client.distube.search(query, {
      limit: 10,
      retried: true,
      safeSearch: true,
      type: "video",
    });
    let tracks = res
      .map((song, index) => {
        return `\`${index + 1}\`) [\`${client.getTitle(song)}\`](${song.url
          }) \`[${song.formattedDuration}]\``;
      })
      .join("\n\n");

    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setTitle(`\`${query}\` Search Results`)
      .setDescription(tracks.substring(0, 3800))
      //   .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter(client.getFooter(message.author));

    let menuraw = new ActionRowBuilder().addComponents([
      new StringSelectMenuBuilder()
        .setCustomId("search")
        .setPlaceholder(`Click to See Best Songs`)
        .addOptions(
          res.map((song, index) => {
            return {
              label: client.getTitle(song),
              value: song.url,
              description: `Click to Play Song`,
              emoji: numberEmojis[index + 1],
            };
          })
        ),
    ]);

    message
      .reply({ embeds: [embed], components: [menuraw] })
      .then(async (msg) => {
        let filter = (i) => i.user.id === message.author.id;
        let collector = await msg.createMessageComponentCollector({
          filter: filter,
        });
        const { channel } = message.member.voice;
        collector.on("collect", async (interaction) => {
          if (interaction.isStringSelectMenu()) {
            await interaction.deferUpdate().catch((e) => { });
            if (interaction.customId === "search") {
              let song = interaction.values[0];
              client.distube.play(channel, song, {
                member: message.member,
                textChannel: message.channel,
              });
            }
          }
        });
      });
  },
};
