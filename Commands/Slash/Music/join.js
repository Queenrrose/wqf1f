const {
    CommandInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
    name: "join",
    description: "Join the voice channel.",
    userPermissions: PermissionFlagsBits.Connect,
    botPermissions: PermissionFlagsBits.Connect,
    category: "Music",
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    inVoiceChannel: true,
    inSameVoiceChannel: true,
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
        if (existingChannel) {
            return interaction.followUp({
                content: `:rolling_eyes: **Music channel already setup in ${existingChannel}**`,
                ephemeral: true,
            });
        }
        try {
            // تحقق إذا كان البوت في قناة صوتية بالفعل
            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId) {
                return interaction.followUp({
                    content: `:no_entry_sign: I'm already in \`${interaction.guild.members.me?.voice?.channel.name}\`!`,
                    ephemeral: true,
                });
            }

            // تحقق إذا كان البوت في قناة صوتية، ولكن العضو في قناة مختلفة
            if (interaction.guild.members.me.voice?.channelId && interaction.member.voice.channelId !== interaction.guild.members.me?.voice?.channelId) {
                return interaction.followUp({
                    content: `:no_entry_sign: You must be in \`${interaction.guild.members.me?.voice?.channel.name}\` to use that!`,
                    ephemeral: true,
                });
            }

            // تحقق إذا كان العضو في قناة صوتية
            let channel = interaction.member.voice.channel;
            if (!channel) {
                return interaction.followUp({
                    content: ":no_entry_sign: You must join a voice channel to use that!",
                    ephemeral: true,
                });
            }

            // الانضمام للقناة الصوتية
            await client.distube.voices.join(channel);
            return interaction.followUp({
                content: `:white_check_mark: Joined \`${channel.name}\``,
                ephemeral: true,
            })

        } catch (err) {
            console.log(err);
            interaction.followUp({
                content: ":no_entry_sign: An error occurred while trying to join the channel.",
                ephemeral: true,
            });
        }
    },
};
