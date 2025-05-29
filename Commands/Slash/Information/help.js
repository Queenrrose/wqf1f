const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  description: `need help ? here is my all commands`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    let existingChannelId = await client.music.get(
      `${interaction.guild.id}.music.channel`
    );
    let existingChannel = interaction.guild.channels.cache.get(existingChannelId);
    if (existingChannel && interaction.channelId === existingChannelId) {
      return interaction.followUp({
        content: `:rolling_eyes: **you can't use this command in this channel**`,
        ephemeral: true,
      });
    }
    // Code
    let embed = new EmbedBuilder()
      .setAuthor({ name: `Information`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`-# Follow one of the buttons in these messages below to get more information.`)
      .setImage(client.config.embed.mainIMG)
      .setColor(client.config.embed.color)

    let inviteBTN = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Invite Bot')
      .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)

    let supportBTN = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Server Support')
      .setURL(`https://discord.gg/Wn6z6yD7n3`)
    let sectionSM = new StringSelectMenuBuilder()
      .setCustomId('section')
      .setPlaceholder('Select a category')
      .addOptions(
        { label: 'information Commands', value: 'info' },
        { label: 'music Commands', value: 'music' },
        { label: 'settings Commands', value: 'settings' },
        { label: 'Plannel guide', value: 'pannel' },
      )
    let row = new ActionRowBuilder()
      .addComponents(inviteBTN, supportBTN)
    let row2 = new ActionRowBuilder()
      .addComponents(sectionSM)
    interaction.followUp({ embeds: [embed], components: [row2, row], ephemeral: true })

  },
};
