const {
    CommandInteraction,
    PermissionFlagsBits,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
    name: "lyrics",
    description: `Show lyrics of the current song or a specified song`,
    userPermissions: PermissionFlagsBits.Connect,
    botPermissions: PermissionFlagsBits.Connect,
    category: "Music",
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "song",
            description: `Name of the song (optional)`,
            type: ApplicationCommandOptionType.String,
            required: false, // جعل الحقل غير مطلوب
        },
    ],
    inVoiceChannel: true,
    inSameVoiceChannel: true,
    Player: false,
    djOnly: true,
    /**
     *
     * @param {JUGNU} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     * @param {Queue} queue
     */
    run: async (client, interaction, args, queue) => {
        try {
            // التحقق من وجود قائمة تشغيل وأغنية حالية
            if (!queue || !queue.songs || queue.songs.length === 0) {
                return interaction.editReply({
                    content: `> **${client.config.emoji.ERROR} There is no song currently playing.**`,
                    ephemeral: true,
                });
            }

            // الحصول على اسم الأغنية من الخيارات أو الأغنية الحالية
            let songName = interaction.options.getString("song");
            let currentSong = queue.songs[0];

            // إذا لم يتم تقديم اسم أغنية، استخدم الأغنية الحالية
            if (!songName) {
                songName = currentSong.name;
            }

            // البحث عن الأغنية في Genius
            const songs = await client.genius.songs.search(songName);
            if (songs.length === 0) {
                return interaction.editReply({
                    content: `> **${client.config.emoji.ERROR} Sorry, I couldn't find the lyrics for *${songName}* **`,
                    ephemeral: true,
                });
            }

            // جلب كلمات الأغنية
            const lyrics = await songs[0].lyrics();

            // تقسيم الكلمات إلى أجزاء إذا كانت طويلة
            const maxEmbedSize = 4000;
            const chunks = [];
            let currentChunk = "";

            const lines = lyrics.split("\n");

            for (const line of lines) {
                if ((currentChunk + line + "\n").length > maxEmbedSize) {
                    chunks.push(currentChunk.trim());
                    currentChunk = line + "\n";
                } else {
                    currentChunk += line + "\n";
                }
            }

            if (currentChunk.trim()) chunks.push(currentChunk.trim());

            // إنشاء Embeds لكل جزء
            const embeds = chunks.map((chunk, index) => {
                return new EmbedBuilder()
                    .setColor(client.config.embed.color)
                    .setTitle(index === 0 ? `Lyrics for: ${songName}` : null) // العنوان فقط في الجزء الأول
                    .setDescription(chunk)
                    .setFooter({
                        text: `Part ${index + 1} of ${chunks.length}`,
                    });
            });

            // إرسال الـ Embed الأول
            await interaction.editReply({
                content: `**> ${client.config.emoji.success} Here are the lyrics for *${songName}***`,
                embeds: [embeds[0]],
                ephemeral: true,
            });

            // إرسال الأجزاء المتبقية كـ Embeds منفصلة
            for (let i = 1; i < embeds.length; i++) {
                await interaction.followUp({
                    embeds: [embeds[i]],
                    ephemeral: true,
                });
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply({
                content: `> **${client.config.emoji.ERROR} An error occurred while fetching the lyrics.**`,
                ephemeral: true,
            });
        }
    },
};