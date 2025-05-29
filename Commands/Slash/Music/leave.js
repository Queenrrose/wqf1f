const {
    CommandInteraction,
    PermissionFlagsBits,
    ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
    name: "leave",
    description: "Make the bot leave the voice channel.",
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
     */
    run: async (client, interaction, args) => {
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
        try {
            // تحقق إذا كان البوت في قناة صوتية
            if (!interaction.guild.members.me.voice?.channelId) {
                return interaction.followUp({
                    content: ":no_entry_sign: I'm not in a voice channel!",
                    ephemeral: true,
                });
            }

            // تحقق إذا كان العضو في نفس القناة الصوتية
            if (interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
                return interaction.followUp({
                    content: `:no_entry_sign: You must be in the same voice channel as me to use this command.`,
                    ephemeral: true,
                });
            }

            // مغادرة القناة الصوتية
            await client.distube.voices.leave(interaction.guild.id);

            // إرسال رسالة تأكيد
            interaction.followUp({
                content: `:white_check_mark: I have left the voice channel \`${interaction.guild.members.me.voice.channel.name}\`.`,
            });
        } catch (err) {
            console.log(err);
            interaction.followUp({
                content: ":no_entry_sign: An error occurred while trying to leave the channel.",
                ephemeral: true,
            });
        }
    },
};
