const config = require("../settings/config.js")
const { EmbedBuilder,ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const client = require("../index");
const { PREFIX } = require("../settings/config.js");
client.once("guildCreate", async (guild) => {
    if (!guild || !guild.name) {
        console.error("Guild object is undefined or missing name property.");
        return;
    }
    const auditLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: 28
    });
    const log = auditLogs.entries.first();
    if (!log) return;
    const inviter = log.executor;

    const em = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
        .setTitle(`Thanks for adding me to your server! \`${guild.name}\``)
        .setDescription(
            `*To get started, join a voice channel and type ${PREFIX}play to play a song* \n\n *If you have any questions or need help [click here](https://discord.gg/MdU5YeNaPT) to join the support server*\n\n*if you need any help, type* **\`${PREFIX}help | /help**\``
        )
        .setColor(config.embed.color);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Support')
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/MdU5YeNaPT")
        );
    if (inviter) {
        await inviter.send({ embeds: [em], components: [row] });
    } else {
        console.log("تعذر العثور على الشخص الذي أضاف البوت.");
    }
    const channel = guild.channels.cache.find(
        (ch) => ch.type === ChannelType.GuildText
    );
    const em1 = new EmbedBuilder()
        .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL() })
        .setTitle(`Thanks for adding me to your server! \`${guild.name}\``)
        .setDescription(
            `*To get started, join a voice channel and type ${PREFIX}play to play a song* \n\n *If you have any questions or need help [click here](https://discord.gg/KSjg3W7T4t) to join the support server*\n\n*if you need any help, type* **\`${PREFIX}help | /help**\``
        )
        .setColor(config.embed.color)

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("Support Server")
                .setURL("https://discord.gg/MdU5YeNaPT")
                .setStyle(ButtonStyle.Link)
        )
    if (channel) {
        channel.send({ embeds: [em1], components: [row1] });
    } else {
        console.log(`لا توجد قناة نصية متاحة في السيرفر: ${guild.name}`);
    }
});
