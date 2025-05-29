const {
  CommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const ytsr = require("@distube/ytsr")
module.exports = {
  name: "search",
  description: `search a song by name`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: false,
  djOnly: false,
  options: [
    {
      name: "song",
      description: `give song url/name to play`,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {

    const string = interaction.options.getString("song");
    const msg = await interaction.followUp(`:watch: **Searching...** (\`${string}\`)`);
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("one")
          .setEmoji("1️⃣")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("two")
          .setEmoji("2️⃣")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("three")
          .setEmoji("3️⃣")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("four")
          .setEmoji("4️⃣")
          .setStyle(ButtonStyle.Secondary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId("five")
          .setEmoji("5️⃣")
          .setStyle(ButtonStyle.Secondary)
      )

    const options = {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction,
    }
    const res = await ytsr(string, { safeSearch: true, limit: 5 });
    let index = 1;
    const result = res.items.slice(0, 5).map(x => `**${index++}. [${x.name}](${x.url})**`).join("\n")
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: `Song Selection`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setDescription(result)
      .setFooter({ text: `Please response in 30s` })
    await msg.edit({ content: " ", embeds: [embed], components: [row] });
    const filter = i => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });
    collector.on('collect', async (interaction) => {
      const id = interaction.customId;
      if (id === "one") {
        await msg.delete({ embeds: [], components: [] });
        await client.distube.play(interaction.member.voice.channel, res.items[0].url, options);
      } else if (id === "two") {
        await msg.delete({ embeds: [], components: [] });
        await client.distube.play(interaction.member.voice.channel, res.items[1].url, options);
      } else if (id === "three") {
        await msg.delete({ embeds: [], components: [] });
        await client.distube.play(interaction.member.voice.channel, res.items[2].url, options);
      } else if (id === "four") {
        await msg.delete({ embeds: [], components: [] });
        await client.distube.play(interaction.member.voice.channel, res.items[3].url, options);
      } else if (id === "five") {
        await msg.delete({ embeds: [], components: [] });
        await client.distube.play(interaction.member.voice.channel, res.items[4].url, options);
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === "time") {
        msg.delete({ content: ``, embeds: [], components: [] });
      }
    });
  },
};
