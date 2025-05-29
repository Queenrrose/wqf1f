const {
  Message,
  EmbedBuilder,
  version,
  PermissionFlagsBits,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
const { msToDuration, formatBytes } = require("../../../handlers/functions");
const os = require("systeminformation");
const pkg = require("../../../package.json");
module.exports = {
  name: "stats",
  aliases: ["botinfo", "stu"],
  description: `see stats of bot`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "owner",
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
    let memory = await os.mem();
    let cpu = await os.cpu();
    let cpuUsage = await (await os.currentLoad()).currentLoad;
    let osInfo = await os.osInfo();
    let TotalRam = formatBytes(memory.total);
    let UsageRam = formatBytes(memory.used);
    const Dev = client.config.Dev
    const messageSentAt = Date.now();
    const msg = await message.channel.send("Fetching stats...");
    const messageLatency = Date.now() - messageSentAt;
    const botCreatedAt = new Date(client.user.createdTimestamp).toString();

    msg.edit({
      content: null,
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.embed.color)
          .setTitle("__**Stats:**__")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `> ** Made by [\` NeXus-Team 2022-2024 \`](https://discord.gg/tmvJJGeFX5) **`
          )
          .addFields([
            {
              name: `Bot Version`,
              value: `\`\`\`${pkg.version}\`\`\``,
              inline: true,
            },
            {
              name: `Library`,
              value: `\`\`\`Discord.js\`\`\``,
              inline: true,
            },
            {
              name: `Prefix`,
              value: `\`\`\`${client.config.PREFIX}\`\`\``,
              inline: true,
            },
            {
              name: `Owner`,
              value: `\`\`\`${Dev}\`\`\``,
              inline: false,
            },
            {
              name: `Uptime`,
              value: `\`\`\`${msToDuration(client.uptime)}\`\`\``,
              inline: false,
            },
            {
              name: `Message Latency`,
              value: `\`\`\`${messageLatency}ms\`\`\``,
              inline: false,
            },
            {
              name: `Memory Used`,
              value: `\`\`\`${UsageRam} / ${TotalRam}\`\`\``,
              inline: true,
            },
            {
              name: `Websocket Latency`,
              value: `\`\`\`${client.ws.ping}ms\`\`\``,
              inline: false,
            },
            {
              name: `Channels`,
              value: `\`\`\`${client.channels.cache.size} Channels\`\`\``,
              inline: true,
            },
            {
              name: `Servers`,
              value: `\`\`\`${client.guilds.cache.size} Servers\`\`\``,
              inline: true,
            },
            {
              name: `Users`,
              value: `\`\`\`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`\`\``,
              inline: true,
            },
            {
              name: `Created at`,
              value: `\`\`\`${botCreatedAt}\`\`\``,
              inline: false,
            },
            {
              name: `Discord Version`,
              value: `\`\`\`v${version}\`\`\``,
              inline: true,
            },
            {
              name: `Node Version`,
              value: `\`\`\`${process.version}\`\`\``,
              inline: true,
            },
            {
              name: `Number of Cores`,
              value: `\`\`\`${cpu.cores}\`\`\``,
              inline: true,
            },
            {
              name: `CPU Model`,
              value: `\`\`\`${cpu.brand}\`\`\``,
              inline: false,
            },
            {
              name: `CPU Speed`,
              value: `\`\`\`${cpu.speed}\`\`\``,
              inline: true,
            },
            {
              name: `CPU Usage`,
              value: `\`\`\`${Math.floor(cpuUsage)}%\`\`\``,
              inline: true,
            },
            {
              name: `OS`,
              value: `\`\`\`${osInfo.platform}\`\`\``,
              inline: false,
            },
            {
              name: `OS Version`,
              value: `\`\`\`${osInfo.release}\`\`\``,
              inline: false,
            },
            {
              name: `OS Arch`,
              value: `\`\`\`${osInfo.arch}\`\`\``,
              inline: true,
            },
            {
              name: `Dev Platform`,
              value: `\`\`\`${osInfo.platform}\`\`\``,
              inline: true,
            },
          ])
          .setFooter(client.getFooter(message.author)),
      ],
    });
  },
};
