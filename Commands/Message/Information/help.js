const { Message, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands"],
  description: `need help ? see my all commands`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
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
      .setURL(`https://discord.gg/aDbC9rfqBs`)
    let sectionSM = new StringSelectMenuBuilder()
      .setCustomId('section1')
      .setPlaceholder('Select a category')
      .addOptions(
        { label: 'information Commands', value: 'info1' },
        { label: 'music Commands', value: 'music1' },
        { label: 'settings Commands', value: 'settings1' },
        { label: 'Plannel guide', value: 'pannel1' },
      )
    let row = new ActionRowBuilder()
      .addComponents(inviteBTN, supportBTN)
    let row2 = new ActionRowBuilder()
      .addComponents(sectionSM)
    message.reply({ embeds: [embed], components: [row2, row], ephemeral: true })


    // await client.HelpCommand(message);
  },
};
