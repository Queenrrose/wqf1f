const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const JUGNU = require("./Client");
const { check_dj, skip, formatTime } = require("./functions");
const ytsr = require("@distube/ytsr");

/**
 * @param {JUGNU} client
 */

module.exports = (client) => {
  try {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.guild || interaction.user.bot) return;
      if (
        interaction.isButton() ||
        interaction.isAnySelectMenu() ||
        interaction.isModalSubmit()
      ) {
        const { customId, member } = interaction;
        let voiceMember = interaction.guild.members.cache.get(member.id);
        let channel = voiceMember.voice.channel;
        let queue = client.distube.getQueue(interaction.guildId);
        let checkDJ = await check_dj(
          client,
          interaction.member,
          queue?.songs[0]
        );
        switch (customId) {
          //START BUTTON HANDLING
          case "autoPlay":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else if (!queue.autoplay) {
                queue.toggleAutoplay();
                return interaction.reply({
                  content: `> **${client.config.emoji.musicTrack} Autoplay Enabled !!**`,
                  ephemeral: true,
                });
              } else {
                queue.toggleAutoplay();
                return interaction.reply({
                  content: `> **${client.config.emoji.musicTrack} Autoplay is Disabled !!**`,
                  ephemeral: true,
                });
              }
            }
            break;
          case "back":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              }

              if (!queue.previousSongs || queue.previousSongs.length === 0) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} There is no previous song in this queue**`,
                  ephemeral: true,
                });
              } else {
                const previousSong =
                  queue.previousSongs[queue.previousSongs.length - 1];
                await client.distube.previous(queue);
                return interaction.reply({
                  content: ` ${client.config.emoji.musicTrack} played the previous song`,
                  ephemeral: true,
                });
              }
            }
            break;

          case "pause":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else if (!queue.paused) {
                await queue.pause();
                interaction.update({
                  components: interaction.message.components.map((row) => {
                    row.components = row.components.map((button) => {
                      if (button.customId === "pause") {
                        return new ButtonBuilder()
                          .setCustomId("pause")
                          .setEmoji(client.config.emoji.play)
                          .setStyle(ButtonStyle.Success);
                      }
                      return button;
                    });
                    return row;
                  }),
                });
              } else if (queue.paused) {
                await queue.resume();
                interaction.update({
                  components: interaction.message.components.map((row) => {
                    row.components = row.components.map((button) => {
                      if (button.customId === "pause") {
                        return new ButtonBuilder()
                          .setCustomId("pause")
                          .setEmoji(client.config.emoji.pause)
                          .setStyle(ButtonStyle.Secondary);
                      }
                      return button;
                    });
                    return row;
                  }),
                });
              }
            }
            break;

          case "skip":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else if (queue.repeatMode === 1) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You can not skip in repeat mode (Song)**`,
                  ephemeral: true,
                });
              } else if (queue.songs.length === 1) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You cannot skip the last song in the queue.**`,
                  ephemeral: true,
                });
              } else {
                await skip(queue);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS} Song Skipped !!**`,
                  ephemeral: true,
                });
              }
            }
            break;
          case "repeat":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else {
                let loopmetod = new StringSelectMenuBuilder()
                  .setCustomId("loop")
                  .setPlaceholder("Select a loop method!")
                  .setOptions([
                    {
                      label: `Queue`,
                      description: `Loop the whole queue`,
                      emoji: client.config.emoji.queuerepet,
                      value: "queue",
                    },
                    {
                      label: `Song`,
                      description: `Loop the current playing song only`,
                      emoji: client.config.emoji.songrepet,
                      value: "song",
                    },
                    {
                      label: `Off`,
                      description: `Disables the loop`,
                      emoji: client.config.emoji.stop,
                      value: "off",
                    },
                  ]);
                const row = new ActionRowBuilder().addComponents(loopmetod);
                return interaction.reply({
                  content: `> **${client.config.emoji.repeat} Select a loop method!**`,
                  components: [row],
                  ephemeral: true,
                });
              }
            }
            break;

          case "volumedown":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              }
              const v = client.distube.getQueue(interaction).volume;
              if (v === 0) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You can't lower the volume below 0.**`,
                  ephemeral: true,
                });
              } else {
                await queue.setVolume(v - 10);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS
                    } Set volume from \`${v}\` to \`${v - 10}\`**`,
                  ephemeral: true,
                });
              }
            }
            break;

          case "rewind":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} I am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              }
              const curtime = client.distube.getQueue(interaction).currentTime;

              if (curtime === 0) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You can't rewind the song when it's at the start (0:00).**`,
                  ephemeral: true,
                });
              } else if (curtime < 10) {
                await client.distube.seek(interaction, 0);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS} Rewinded the song to the start (0:00).**`,
                  ephemeral: true,
                });
              } else {
                const newTime = curtime - 10;
                await queue.seek(newTime);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS
                    } Rewinded the song to \`${formatTime(newTime)}\`**`,
                  ephemeral: true,
                });
              }
            }
            break;

          case "favorite":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} I am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else {
                const userId = interaction.user.id;
                let userData = await client.playlist.get(userId);

                if (!userData || userData.list.length === 0) {
                  return interaction.reply({
                    content: "❌ You don't have any playlists yet.",
                    ephemeral: true
                  });
                }
                const playlistOptions = userData.list.map((playlist, index) => {
                  const playlistName = Object.keys(playlist)[0];
                  return {
                    label: playlistName,
                    description: `View ${playlistName}`,
                    value: playlistName,
                  };
                });

                // إنشاء السيلكت من نوع StringSelectMenu
                const listSM = new StringSelectMenuBuilder()
                  .setCustomId("pushsongs")
                  .setPlaceholder("Select a playlist")
                  .setOptions(playlistOptions);  // إضافة القوائم إلى الخيارات

                const listRow = new ActionRowBuilder().addComponents(listSM);

                return interaction.reply({
                  content: `> **please Select playlist to add song to it**`,
                  components: [listRow],
                  ephemeral: true
                });
              }
            }
            break;
          case "forward":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} I am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else {
                const curtime =
                  client.distube.getQueue(interaction).currentTime;
                const newTime = curtime + 10;
                await queue.seek(newTime);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS
                    } forward the song to \`${formatTime(newTime)}\`**`,
                  ephemeral: true,
                });
              }
            }
            break;
          case "volumeup":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              }
              const v = client.distube.getQueue(interaction).volume;
              if (v === 250) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You can't lower the volume below 250.**`,
                  ephemeral: true,
                });
              } else {
                await queue.setVolume(v + 10);
                return interaction.reply({
                  content: `> **${client.config.emoji.SUCCESS
                    } Set volume from \`${v}\` to \`${v + 10}\`**`,
                  ephemeral: true,
                });
              }
            }
            break;
            case "lyrics": {
              if (!channel) {
                  return interaction.reply({
                      content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                      ephemeral: true,
                  });
              } else if (
                  interaction.guild.members.me.voice.channel &&
                  !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                  return interaction.reply({
                      content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                      ephemeral: true,
                  });
              } else if (!queue) {
                  return interaction.reply({
                      content: `> **${client.config.emoji.ERROR} I am Not Playing Right Now**`,
                      ephemeral: true,
                  });
              } else if (checkDJ) {
                  return interaction.reply({
                      content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                      ephemeral: true,
                  });
              } else {
                  const msg = await interaction.reply({
                      content: `**> ${client.config.emoji.search} Searching lyrics...**`,
                      ephemeral: true,
                  });
          
                  const song = queue.songs[0];
                  const songName = song.name;
          
                  try {
                      const songs = await client.genius.songs.search(songName);
                      if (songs.length === 0) {
                          return msg.edit({
                              content: `> **${client.config.emoji.ERROR} Sorry, I couldn't find the lyrics for *${songName}* **`,
                              ephemeral: true,
                          });
                      }
          
                      const lyrics = await songs[0].lyrics();
          
                      const maxEmbedSize = 4000;
                      const chunks = [];
                      let currentChunk = "";
          
                      // تقسيم النص إلى أسطر
                      const lines = lyrics.split("\n");
          
                      for (const line of lines) {
                          if ((currentChunk + line + "\n").length > maxEmbedSize) {
                              chunks.push(currentChunk.trim()); // إضافة الجزء الحالي بعد إزالة المسافات الزائدة
                              currentChunk = line + "\n"; // بدء جزء جديد بالسطر الحالي
                          } else {
                              currentChunk += line + "\n"; // إضافة السطر الحالي إلى الجزء الحالي
                          }
                      }
          
                      if (currentChunk.trim()) chunks.push(currentChunk.trim());
                      const embeds = chunks.map((chunk, index) => {
                          return new EmbedBuilder()
                              .setColor(client.config.embed.color)
                              .setTitle(index === 0 ? `Lyrics for: ${songName}` : null) // العنوان فقط في الجزء الأول
                              .setDescription(chunk)
                              .setFooter({
                                  text: `Part ${index + 1} of ${chunks.length}`,
                              });
                      });
                      await msg.edit({
                          content: `**> ${client.config.emoji.success} Here are the lyrics for *${songName}***`,
                          embeds: [embeds[0]], // إرسال الـ Embed الأول فقط
                          ephemeral: true,
                      });
          
                      // إرسال الـ Embeds المتبقية كرسائل منفصلة
                      for (let i = 1; i < embeds.length; i++) {
                          await interaction.followUp({
                              embeds: [embeds[i]],
                              ephemeral: true,
                          });
                      }
          
                  } catch (error) {
                      console.error(error);
                      await msg.edit({
                          content: `> **${client.config.emoji.ERROR} An error occurred while fetching the lyrics.**`,
                          ephemeral: true,
                      });
                  }
              }
              break;
          }
          case "shuffle":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not song requester..**`,
                  ephemeral: true,
                });
              } else {
                if (queue.songs.length <= 1) {
                  return interaction.reply({
                    content: `> **${client.config.emoji.ERROR} Not enough songs in the queue to shuffle.**`,
                    ephemeral: true,
                  });
                } else {
                  queue.shuffle();
                  await client.updatequeue(queue);
                  return interaction.reply({
                    content: `> **${client.config.emoji.SUCCESS} Songs shuffled in the queue!**`,
                    ephemeral: true,
                  });
                }
              }
            }
            break;
          case "stop": {
            let existingChannelId = await client.music.get(
              `${interaction.guild.id}.music.channel`
            );
            let existingChannel =
              interaction.guild.channels.cache.get(existingChannelId);

            if (
              existingChannel &&
              interaction.channelId === existingChannelId
            ) {
              if (!channel) {
                await interaction.deferReply({ ephemeral: true });
                return interaction.editReply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                await interaction.deferReply({ ephemeral: true });
                return interaction.editReply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                });
              } else if (!queue) {
                await interaction.deferReply({ ephemeral: true });
                return interaction.editReply({
                  content: `> **${client.config.emoji.ERROR} I am Not Playing Right Now**`,
                });
              } else if (checkDJ) {
                await interaction.deferReply({ ephemeral: true });
                return interaction.editReply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                });
              } else {
                await interaction.deferReply({ ephemeral: true });
                const guild = client.guilds.cache.get(queue.textChannel.guildId);
                if (!guild) return;

                const data = await client.music.get(`${guild.id}.music`);
                if (!data) return;

                const musicchannel = guild.channels.cache.get(data.channel);
                if (!musicchannel) return;

                let playembed = await musicchannel.messages
                  .fetch(data.pmsg)
                  .catch(() => { });
                let queueembed = await musicchannel.messages
                  .fetch(data.qmsg)
                  .catch(() => { });
                if (!playembed) return;

                const embed = client.playembed(interaction.guild);
                const qembed = client.queueembed(interaction.guild);
                let s = new StringSelectMenuBuilder()
                  .setCustomId("music")
                  .setPlaceholder("Suggestion Track")
                  .addOptions([
                    {
                      label: "Music",
                      description: "Music",
                      value: "music",
                    },
                  ])
                  .setDisabled(true);
                let r = new ActionRowBuilder().addComponents(s);
                await playembed.edit({
                  embeds: [embed],
                  components: [
                    r,
                    client.buttons4(false),
                    client.buttons(true),
                    client.buttons1(true),
                    client.buttons2(true),
                  ],
                });
                await queueembed.edit({
                  embeds: [qembed],
                  components: [],
                });
                await queue.stop().catch((e) => { });
                await client.distube.voices.leave(interaction.guild.id);
                return interaction.editReply({
                  content: `> **${client.config.emoji.SUCCESS} Song Stopped**`,
                });
              }
            } else {
              await interaction.deferReply({ ephemeral: true });
              await queue.stop().catch((e) => { });
              await client.distube.voices.leave(interaction.guild.id);
              await interaction.editReply({
                content: `> **${client.config.emoji.SUCCESS} Song Stopped**`,
              });
              let em = new EmbedBuilder()
                .setAuthor({
                  name: `Queue Ended!`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setColor(client.config.embed.color)
                .setDescription(`All songs have been played! You can add songs again using \`/play\` command.
Checkout our [premium plans](https://discord.gg/KSjg3W7T4t) for best music experience!`);
              await interaction.channel.send({ embeds: [em] });
              return interaction.message.delete();
            }
          }
            break;

          case "filter":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                const filters = Object.keys(client.config.filters);
                const row = new ActionRowBuilder().addComponents([
                  new StringSelectMenuBuilder()
                    .setCustomId("filter-menu")
                    .setPlaceholder("Click To Select Filter")
                    .addOptions(
                      [
                        {
                          label: `Off`,
                          description: `Click to Disable Filter`,
                          value: "off",
                        },
                        filters
                          .filter((_, index) => index <= 22)
                          .map((value) => {
                            return {
                              label: value.toLocaleUpperCase(),
                              description: `Click to Set ${value} Filter`,
                              value: value,
                            };
                          }),
                      ].flat(Infinity)
                    ),
                ]);

                return interaction.reply({
                  content: `Filters Menu`,
                  components: [row],
                  ephemeral: true,
                });
              }
            }
            break;
          case "artist":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                const modal = new ModalBuilder({
                  custom_id: "artistmodal",
                  title: "Artist Name!!",
                });
                const artistInput = new TextInputBuilder({
                  custom_id: "artistinput",
                  label: "type artist name to search",
                  placeholder: "Artist Name",
                  style: TextInputStyle.Short,
                  required: true,
                });
                const artistrow = new ActionRowBuilder().addComponents(
                  artistInput
                );
                modal.addComponents(artistrow);
                return interaction.showModal(modal);
              }
            }
            break;


          //END BUTTON HANDLING

          ///////////////////////////////////////////////////////////////////////////////////////

          //START SELECT HANDLING
          case "pushsongs":
            const user = interaction.values[0]; // الحصول على اسم قائمة التشغيل المختارة
            const currentSong = queue.songs[0];

            if (!currentSong) {
              return interaction.update({
                content: `❌ No song is currently playing.`,
                ephemeral: true
              });
            }

            // الحصول على بيانات المستخدم
            const userid1 = interaction.user.id;
            let userDAta1 = await client.playlist.get(userid1);

            if (!userDAta1 || userDAta1.list.length === 0) {
              return interaction.update({
                content: "❌ You don't have any playlists.",
                ephemeral: true
              });
            }

            // العثور على قائمة التشغيل المختارة
            const playlist = userDAta1.list.find((playlist) => playlist.hasOwnProperty(user));

            if (!playlist) {
              return interaction.update({
                content: `❌ Playlist with the name \`${user}\` not found.`,
                ephemeral: true
              });
            }

            // التحقق من وجود الأغنية بالفعل في قائمة التشغيل
            const songIndex = playlist[user].songs.findIndex(song => song.url === currentSong.url);

            if (songIndex !== -1) {
              // إزالة الأغنية إذا كانت موجودة
              playlist[user].songs.splice(songIndex, 1);
              await client.playlist.set(userid1, userDAta1);
              return interaction.update({
                content: `✅ Song removed from the playlist \`${user}\` successfully!`,
                components: [],
                ephemeral: true
              });
            }

            // إضافة الأغنية إذا لم تكن موجودة
            playlist[user].songs.push({
              name: currentSong.name,
              url: currentSong.url,
            });

            // تحديث بيانات المستخدم
            await client.playlist.set(userid1, userDAta1);

            return interaction.update({
              content: `✅ Song added to the playlist \`${user}\` successfully!`,
              components: [],
              ephemeral: true
            });
            break;


          case "suggestion":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                const selectedTrackUrl = interaction.values[0];
                const searchResults = await ytsr(selectedTrackUrl, {
                  safeSearch: true,
                  limit: 1,
                });
                if (!searchResults.items || searchResults.items.length === 0) {
                  return interaction.reply({
                    content: `> **${client.config.emoji.ERROR} No results found for ${selectedTrackUrl}**`,
                    ephemeral: true,
                  });
                }
                const selectedTrack = searchResults.items[0];
                await interaction.reply({
                  content: `> **${selectedTrack.name}** added to the queue (\`${selectedTrack.duration}\`)`,
                  ephemeral: true,
                });

                client.distube.play(
                  interaction.member.voice.channel,
                  selectedTrack.url,
                  {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    message: interaction.message,
                  }
                );
              }
            }
            break;

          case "loop":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                const value = interaction.values[0];
                if (queue.songs.length === 1 && value === "queue") {
                  interaction.update({
                    content: `${client.config.emoji.ERROR} You cannot loop the entire queue with only one song.`,
                    embeds: [],
                    components: [],
                    ephemeral: true,
                  });
                } else if (value === "queue") {
                  client.distube.setRepeatMode(interaction.guild.id, 2);
                  interaction.update({
                    content: `**> ${client.config.emoji.queuerepet} repeating the entire queue**`,
                    embeds: [],
                    components: [],
                    ephemeral: true,
                  });
                } else if (value === "song") {
                  client.distube.setRepeatMode(interaction.guild.id, 1);
                  interaction.update({
                    content: `**> ${client.config.emoji.songrepet} repeating the current song**`,
                    embeds: [],
                    components: [],
                    ephemeral: true,
                  });
                } else if (value === "off") {
                  client.distube.setRepeatMode(interaction.guild.id, 0);
                  interaction.update({
                    content: `**> ${client.config.emoji.stop} stopped repeating**`,
                    embeds: [],
                    components: [],
                    ephemeral: true,
                  });
                }
              }
            }
            break;
          case "filter-menu":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                let filter = interaction.values[0];
                if (filter === "off") {
                  queue.filters.clear();
                  interaction.reply({
                    content: `> **${client.config.emoji.SUCCESS} Queue Filter Off !!**`,
                    ephemeral: true,
                  });
                } else {
                  if (queue.filters.has(filter)) {
                    queue.filters.remove(filter);
                  } else {
                    queue.filters.add(filter);
                  }
                  interaction.reply({
                    content: `> **${client.config.emoji.SUCCESS
                      } | Current Queue Filter: \`${queue.filters.names.join(
                        ", "
                      )}\`**`,
                    ephemeral: true,
                  });
                }
              }
            }
            break;

          case "section1":
            {
              let cmdEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the music commands you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `\`${client.config.PREFIX}\`autoplay`, value: `toggle autoplay in your server \nShortcuts:\`[ap, auto]\`` },
                  { name: `\`${client.config.PREFIX}\`clearqueue`, value: `clear current queue of server\nShortcuts:\`[clr, cq, empty]\`` },
                  { name: `\`${client.config.PREFIX}\`join`, value: `join the voice channel.\nNo aliases` },
                  { name: `\`${client.config.PREFIX}\`jump`, value: `jump to a song in queue by index\n No aliases` },
                  { name: `\`${client.config.PREFIX}\`leave`, value: `leave the voice channel.\nShortcuts:\` [disconnect, dc]\`` },
                  { name: `\`${client.config.PREFIX}\`loop`, value: `toggle queue/song/off repeat mode\nShortcuts:\`[loop, rp]\`` },
                  { name: `\`${client.config.PREFIX}\`lyrics`, value: `Find Lyrics Of Current Song\nShortcuts:\`[ly, lyric]\`` },
                  { name: `\`${client.config.PREFIX}\`nowplaying`, value: `see what is playing now\nShortcuts:\`[np, status, song, songinfo, playing]\`` },
                  { name: `\`${client.config.PREFIX}\`pause`, value: `pause current server queue\nShortcuts:\`[pu, break]\`` },
                  { name: `\`${client.config.PREFIX}\`play`, value: `play your fav by Name/Link\nShortcuts:\`[p]\`` },
                  { name: `\`${client.config.PREFIX}\`playprevious`, value: `play previous song of queue\nShortcuts:\`[prev, back, b]\`` },
                  { name: `\`${client.config.PREFIX}\`playskip`, value: `play song by skip current song Name/Link\nShortcuts:\`[ps, pskip]\`` },
                  { name: `\`${client.config.PREFIX}\`queue`, value: `see current queue with pagination\nShortcuts:\` [q, list]\`` },
                  { name: `\`${client.config.PREFIX}\`remove`, value: `remove a song from current queue\nShortcuts:\` [rm, del, delete]\`` },
                  { name: `\`${client.config.PREFIX}\`resume`, value: `resume paused song in queue\nShortcuts:\`[r, continue]\`` },
                  { name: `\`${client.config.PREFIX}\`search`, value: `search a song by name\nShortcuts:\`[find, yts, youtube]\`` },
                  { name: `\`${client.config.PREFIX}\`seek`, value: `seek then current song\nShortcuts:\`[sk]\`` },
                  { name: `\`${client.config.PREFIX}\`shuffle`, value: `shuffle current queue\nShortcuts:\`[sh]\`` },
                  { name: `\`${client.config.PREFIX}\`skip`, value: `skip to next song in queue\nShortcuts:\`[s]\`` },
                  { name: `\`${client.config.PREFIX}\`stop`, value: `destroy current queue of server\nShortcuts:\`[st]\`` },
                  { name: `\`${client.config.PREFIX}\`unshuffle`, value: `unshuffle current shuffled queue\nShortcuts:\`[unsfl]\`` },
                  { name: `\`${client.config.PREFIX}\`volume`, value: `change volume of current queue\nShortcuts:\`[vol]\`` },
                )
              let infEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the information commands you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `\`${client.config.PREFIX}\`help`, value: `need help ? see my all commands\nShortcuts:\`[h, cmds, commands]\`` },
                  { name: `\`${client.config.PREFIX}\`invite`, value: `Get My Invite Link For Add me !!\nShortcuts:\`[inv, addme]\`` },
                  { name: `\`${client.config.PREFIX}\`ping`, value: `Get the bot's ping and latency information\nShortcuts:\`[latency]\`` },
                )
              let settingEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the settings command you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `\`${client.config.PREFIX}\`247`, value: `Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it.\nShortcuts:\`[24/7, 24-7]\`` },
                  { name: `\`${client.config.PREFIX}\`autoresume`, value: `toggle autoresume system on/off\nShortcuts:\`[atresume]\`` },
                  { name: `\`${client.config.PREFIX}\`config`, value: `see config of current server\`[cnf]\`` },
                  { name: `\`${client.config.PREFIX}\`dj`, value: `DJ system on/off\nShortcuts:\`[setupdj]\`` },
                  { name: `\`${client.config.PREFIX}\`prefix`, value: `change prefix of current server\nShortcuts:\`[prefix, setprefix]\`` },
                  { name: `\`${client.config.PREFIX}\`reset`, value: `reset to default settings\nShortcuts:\`["reset"]\`` },
                  { name: `\`${client.config.PREFIX}\`setupmusic`, value: `setup music channel in server\nShortcuts:\`[setmusic, setup]\`` },
                )
              let pnembed = new EmbedBuilder()
                .setColor(client.config.embed.color)
                .setDescription(
                  "-# Here a guide on how to use the music plannel."
                )
                .setImage(client.config.embed.pannelIMG);
              const value = interaction.values[0];
              if (value === "music1") {
                interaction.update({
                  embeds: [cmdEmbed],
                });
              } else if (value === "info1") {
                interaction.update({
                  embeds: [infEmbed],
                });
              } else if (value === "settings1") {
                interaction.update({
                  embeds: [settingEmbed],
                });
              } else if (value === "pannel1") {
                interaction.update({
                  embeds: [pnembed],
                });
              }
            }
            break;
          case "section":
            {
              let cmdEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the music commands you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `/autoplay`, value: `toggle autoplay in your server ` },
                  { name: `/clearqueue`, value: `clear current queue of server` },
                  { name: `/join`, value: `join the voice channel` },
                  { name: `/jump`, value: `jump to a song in queue by indexn` },
                  { name: `/leave`, value: `leave the voice channel` },
                  { name: `/loop`, value: `toggle queue/song/off repeat mode` },
                  { name: `/lyrics`, value: `Find Lyrics Of Current Song` },
                  { name: `/nowplaying`, value: `see what is playing now` },
                  { name: `/pause`, value: `pause current server queue[pu, break]\`` },
                  { name: `/play`, value: `play your fav by Name/Link` },
                  { name: `/playprevious`, value: `play previous song of queue` },
                  { name: `/playskip`, value: `play song by skip current song Name/Link` },
                  { name: `/queue`, value: `see current queue with pagination` },
                  { name: `/remove`, value: `remove a song from current queue` },
                  { name: `/resume`, value: `resume paused song in queue` },
                  { name: `/search`, value: `search a song by name` },
                  { name: `/seek`, value: `seek then current song[sk]` },
                  { name: `/shuffle`, value: `shuffle current queue[sh]` },
                  { name: `/skip`, value: `skip to next song in queue` },
                  { name: `/stop`, value: `destroy current queue of server` },
                  { name: `/volume`, value: `change volume of current queue` },
                )
              let infEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the information commands you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `/help`, value: `need help ? see my all commands` },
                  { name: `/invite`, value: `Get My Invite Link For Add me !!` },
                  { name: `/ping`, value: `Get the bot's ping and latency information` },
                )
              let settingEmbed = new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription("-# Here are all the settings command you can use:")
                .setColor(client.config.embed.color)
                .addFields(
                  { name: `/247`, value: `Toggles the 24/7 mode. This makes the bot doesn't leave the voice channel until you stop it` },
                  { name: `/autoresume`, value: `toggle autoresume system on/off` },
                  { name: `/config`, value: `see config of current server` },
                  { name: `/dj`, value: `DJ system on/off` },
                  { name: `/prefix`, value: `change prefix of current server` },
                  { name: `/reset`, value: `reset to default settings` },
                  { name: `/setupmusic`, value: `setup music channel in server` },
                )
              let pnembed = new EmbedBuilder()
                .setColor(client.config.embed.color)
                .setDescription(
                  "-# Here a guide on how to use the music plannel."
                )
                .setImage(client.config.embed.pannelIMG);

              const value = interaction.values[0];
              if (value === "music") {
                interaction.update({
                  embeds: [cmdEmbed],
                });
              } else if (value === "info") {
                interaction.update({
                  embeds: [infEmbed],
                });
              } else if (value === "settings") {
                interaction.update({
                  embeds: [settingEmbed],
                });
              } else if (value === "pannel") {
                interaction.update({
                  embeds: [pnembed],
                });
              }
            }
            break;
          case "playlist":
            if (value === "view") { }
            break;
          case "playlistview":
            const PNAME = interaction.values[0]; // الحصول على اسم قائمة التشغيل المختارة
            const UID = interaction.user.id;

            // جلب بيانات المستخدم من قاعدة البيانات
            let UD = await client.playlist.get(UID);

            if (!UD || UD.list.length === 0) {
              return interaction.update({
                content: "❌ You don't have any playlists.",
                components: [],
                ephemeral: true
              });
            }

            // العثور على قائمة التشغيل المختارة
            const P = UD.list.find((pl) => pl.hasOwnProperty(PNAME));

            if (!P) {
              return interaction.update({
                content: `❌ Playlist with the name \`${PNAME}\` not found.`,
                components: [],
                ephemeral: true
              });
            }

            // جلب الأغاني من قائمة التشغيل
            const songs = P[PNAME].songs;

            const isDisabled = songs.length === 0;

            const em = new EmbedBuilder()
              .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`🎵 Playlist: ${PNAME}`)
              .setDescription(isDisabled ? 'No songs available.' : songs.map((song, index) => `**${index + 1}.** [${song.name}](${song.url})`).join("\n"))
              .addFields({ name: `Visibility`, value: `${P[PNAME].isPublic ? "Public" : "Private"}` })
              .setFooter({ text: `Page 1 of ${Math.ceil(songs.length / 10) || 0}` })
              .setColor(client.config.embed.color);

            const r = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("rename")
                  .setLabel("Rename Playlist")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("changepriv")
                  .setLabel("Change Visibility")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("shufflePlaylist")
                  .setLabel("Shuffle")
                  .setDisabled(isDisabled)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("del")
                  .setLabel("Delete Playlist")
                  .setStyle(ButtonStyle.Danger),
              );

            const r2 = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("p")
                  .setLabel("Previous")
                  .setDisabled(isDisabled)
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("n")
                  .setLabel("Next")
                  .setDisabled(isDisabled)
                  .setStyle(ButtonStyle.Primary),
              );

            return interaction.update({
              embeds: [em],
              components: [r, r2],
              ephemeral: true
            });
            break;
          ///////////////////////////////////////////////////////////////////////////////////////

          //START MODAL HANDLING
          case "artistmodal":
            {
              if (!channel) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join Voice Channel**`,
                  ephemeral: true,
                });
              } else if (
                interaction.guild.members.me.voice.channel &&
                !interaction.guild.members.me.voice.channel.equals(channel)
              ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You Need to Join __My__ Voice Channel**`,
                  ephemeral: true,
                });
              } else if (!queue) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} i am Not Playing Right Now**`,
                  ephemeral: true,
                });
              } else if (checkDJ) {
                return interaction.reply({
                  content: `> **${client.config.emoji.ERROR} You are not DJ and also you are not the song requester..**`,
                  ephemeral: true,
                });
              } else {
                const artistName =
                  interaction.fields.getTextInputValue("artistinput");
                const searchResults = await ytsr(`${artistName} top songs`, {
                  limit: 10,
                });
                const songUrls = searchResults.items
                  .filter((item) => item.type === "video")
                  .filter((item) => {
                    const duration = item.duration.split(":");
                    let totalSeconds = 0;

                    if (duration.length === 3) {
                      const hours = parseInt(duration[0]);
                      const minutes = parseInt(duration[1]);
                      const seconds = parseInt(duration[2]);
                      totalSeconds = hours * 3600 + minutes * 60 + seconds;
                    } else if (duration.length === 2) {
                      const minutes = parseInt(duration[0]);
                      const seconds = parseInt(duration[1]);
                      totalSeconds = minutes * 60 + seconds;
                    }

                    return totalSeconds <= 600;
                  })
                  .slice(0, 5)
                  .map((item) => item.url);
                songUrls.forEach((url) => {
                  const queue = client.distube.getQueue(interaction.guild.id);
                  if (!queue) {
                    client.distube.createQueue(interaction.guild.id);
                  }
                  client.distube.play(interaction.member.voice.channel, url, {
                    member: interaction.member,
                  });
                });
                return interaction.reply({
                  content: `> 🎶 Added the **top 5 songs** by **${artistName}** to the queue!`,
                  ephemeral: true,
                });
              }
            }
            break;
          case "createplaylist":
            const playlistName = interaction.fields.getTextInputValue("playlistname");
            let isPublic = interaction.fields.getTextInputValue("prevpalylist");
            const userId = interaction.user.id;
            let userData = await client.playlist.get(userId);

            if (!userData) {
              userData = { list: [] };
            }
            const playlistExists = userData.list.some(playlist => playlist.hasOwnProperty(playlistName));

            if (playlistExists) {
              return interaction.reply({
                content: `❌ Playlist with the name \`${playlistName}\` already exists! Please choose a different name.`,
                ephemeral: true,
              });
            }
            if (isPublic !== "true" && isPublic !== "false") {
              return interaction.reply({
                content: `❌ Invalid value for "isPublic". It must be either \`true\` or \`false\``,
                ephemeral: true,
              });
            }
            isPublic = (isPublic === "true");

            userData.list.push({
              [playlistName]: {
                isPublic: isPublic,
                songs: []
              }
            });

            await client.playlist.set(userId, userData);
            return interaction.reply({
              content: `✅ Playlist created successfully! Name: \`${playlistName}\`, Public: \`${isPublic}\``,
              ephemeral: true,
            });
            break;
          case "membermodal": {
            const memberid = interaction.fields.getTextInputValue("userID");
            const memberData = await client.playlist.get(memberid);

            if (!memberData || memberData.list.length === 0) {
              return interaction.reply({
                content: "❌ You don't have any playlists yet.",
                ephemeral: true,
              });
            }

            // فلترة القوائم العامة فقط
            const publicPlaylists = memberData.list.filter((playlist) => {
              const playlistName = Object.keys(playlist)[0];
              const playlistDetails = playlist[playlistName];
              return playlistDetails.isPublic === true;
            });
            if (publicPlaylists.length === 0) {
              return interaction.reply({
                content: "❌ You don't have any public playlists.",
                ephemeral: true,
              });
            }

            const playlistOptions = publicPlaylists.map((playlist, index) => {
              const playlistName = Object.keys(playlist)[0];
              return {
                label: playlistName,
                description: `View ${playlistName}`,
                value: JSON.stringify({ memberid, playlistName }),
              };
            });

            const listSM = new StringSelectMenuBuilder()
              .setCustomId("memberlist")
              .setPlaceholder("Select a playlist")
              .setOptions(playlistOptions);

            const listRow = new ActionRowBuilder().addComponents(listSM);

            return interaction.reply({
              components: [listRow],
              ephemeral: true,
            });
          }


          case "memberlist": {
            const { memberid, playlistName } = JSON.parse(interaction.values[0]);
            const memberData = await client.playlist.get(memberid);

            if (!memberData || memberData.list.length === 0) {
              return interaction.reply({
                content: "❌ Playlist data could not be loaded.",
                ephemeral: true,
              });
            }
            const selectedPlaylist = memberData.list.find(
              (playlist) => Object.keys(playlist)[0] === playlistName
            );

            if (!selectedPlaylist) {
              return interaction.update({
                content: "❌ Playlist not found.",
                components: [],
                ephemeral: true,
              });
            }

            const playlistData = selectedPlaylist[playlistName];
            const songs = playlistData.songs;
            if (!Array.isArray(songs) || songs.length === 0) {
              return interaction.update({
                content: `❌ The playlist "${playlistName}" is empty.`,
                components: [],
                ephemeral: true,
              });
            }

            // إنشاء Embed لعرض الأغاني
            const embed = new EmbedBuilder()
              .setTitle(`🎵 Playlist: ${playlistName}`)
              .setDescription(
                songs
                  .map((song, index) => `${index + 1}. [${song.name}](${song.url})`)
                  .join("\n")
              )
              .setColor(client.config.embed.color);

            return interaction.update({
              embeds: [embed],
              components: [],
              ephemeral: true,
            });
          }




          //END MODAL HANDLING

          ///////////////////////////////////////////////////////////////////////////////////////
          //PLAYLIST HANDLING

          case "playlistControl":
            const value = interaction.values[0];
            {
              switch (value) {
                case "create":
                  const ctratemodal = new ModalBuilder({
                    custom_id: "createplaylist",
                    title: "Create a new playlist",
                  })

                  const PlaylistInput = new TextInputBuilder({
                    custom_id: "playlistname",
                    label: "playlist name",
                    placeholder: "enter a name for your playlist",
                    style: TextInputStyle.Short,
                    required: true,
                  });
                  const privInput = new TextInputBuilder({

                    custom_id: "prevpalylist",
                    label: "Public playlist?",
                    placeholder: "enter true or false",
                    value: "false",
                    style: TextInputStyle.Short,
                    required: true,
                  });
                  const Playlistrow = new ActionRowBuilder().addComponents(
                    PlaylistInput,
                  );
                  const privrow = new ActionRowBuilder().addComponents(
                    privInput
                  );
                  ctratemodal.addComponents(Playlistrow, privrow);
                  return interaction.showModal(ctratemodal);
                  break;
                case "view":
                  const userId = interaction.user.id;
                  let userData = await client.playlist.get(userId);

                  if (!userData || userData.list.length === 0) {
                    return interaction.reply({
                      content: "❌ You don't have any playlists yet.",
                      ephemeral: true
                    });
                  }
                  const playlistOptions = userData.list.map((playlist, index) => {
                    const playlistName = Object.keys(playlist)[0];
                    return {
                      label: playlistName,
                      description: `View ${playlistName}`,
                      value: playlistName,
                    };
                  });
                  const listSM = new StringSelectMenuBuilder()
                    .setCustomId("playlistview")
                    .setPlaceholder("Select a playlist")
                    .setOptions(playlistOptions);

                  const listRow = new ActionRowBuilder().addComponents(listSM);

                  return interaction.reply({
                    components: [listRow],
                    ephemeral: true
                  });
                  break;
                case "other":
                  const membermodal = new ModalBuilder()
                    .setCustomId("membermodal")
                    .setTitle("Playlist")
                  const memberInput = new TextInputBuilder({
                    custom_id: "userID",
                    label: "user (ID) to view playlist",
                    placeholder: "enter Userid to view their playlist",
                    style: TextInputStyle.Short,
                    required: true,
                  });
                  const memberrow = new ActionRowBuilder().addComponents(
                    memberInput,
                  );

                  membermodal.addComponents(memberrow);
                  return interaction.showModal(membermodal);
                  break;
              }
            }
            break;
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};
