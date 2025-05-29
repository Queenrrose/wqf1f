const JUGNU = require("./Client");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  CommandInteraction,
  ChannelType,
  Guild,
  StringSelectMenuBuilder
} = require("discord.js");
const { Queue, Song } = require("distube");

/**
 *
 * @param {JUGNU} client
 */
module.exports = async (client) => {
  // code
  /**
   *
   * @param {Queue} queue
   */
  client.buttons = (state) => {
    let raw = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`autoPlay`).setEmoji(client.config.emoji.autoplay).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`back`).setEmoji(client.config.emoji.back).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`pause`).setEmoji(client.config.emoji.pause).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`skip`).setEmoji(client.config.emoji.skip).setStyle(ButtonStyle.Secondary).setDisabled(state).setDisabled(state),
      new ButtonBuilder().setCustomId(`repeat`).setEmoji(client.config.emoji.repeat).setStyle(ButtonStyle.Secondary).setDisabled(state),
    );
    return raw;
  };
  client.buttons1 = (state) => {
    let raw1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`volumedown`).setEmoji(client.config.emoji.volumedown).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`rewind`).setEmoji(client.config.emoji.rewind).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`favorite`).setEmoji(client.config.emoji.favorite).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`forward`).setEmoji(client.config.emoji.forward).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`volumeup`).setEmoji(client.config.emoji.volumeup).setStyle(ButtonStyle.Secondary).setDisabled(state),
    );
    return raw1;
  };
  client.buttons2 = (state) => {
    let raw2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`lyrics`).setEmoji(client.config.emoji.lyrics).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`shuffle`).setEmoji(client.config.emoji.shuffle).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`stop`).setEmoji(client.config.emoji.stop).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`filter`).setEmoji(client.config.emoji.filter).setStyle(ButtonStyle.Secondary).setDisabled(state),
      new ButtonBuilder().setCustomId(`artist`).setEmoji(client.config.emoji.artist).setStyle(ButtonStyle.Secondary).setDisabled(state),
    );
    return raw2;
  };
  client.buttons3 = (state) => {
    let raw3 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`queue`)
        .setPlaceholder("Suggestion Track")
        .addOptions([
          {
            label: "Suggestion Track",
            description: "Suggestion Track",
            value: "suggestion",
          }
        ])
        .setDisabled(state),
    );
    return raw3;
  };
  client.buttons4 = (state) => {
    let raw4 = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`playlistControl`)
        .setPlaceholder("Control Playlist")
        .addOptions([
          {
            label: "Createlist",
            description: "Create a new playlist",
            value: "create",
          },
          {
            label: "View playlist",
            description: "View playlist",
            value: "view",
          },
          {
            label: "Other playlist",
            description: "View playlist for other user",
            value: "other",
          },
          {
            label: "Playlist",
            description: "Play your playlist",
            value: "playlist",
          },
        ])
        .setDisabled(state),
    );
    return raw4;
  };

  client.editPlayerMessage = async (channel) => {
    const ID = client.temp.get(channel.guild.id);
    if (!ID) return;

    let playembed =
      channel.messages.cache.get(ID) ||
      (await channel.messages.fetch(ID).catch(console.error));
    if (!playembed) return;

    if (client.config.options.nowplayingMsg) {
      playembed.delete().catch(() => { });
    } else {
      const embeds = playembed?.embeds?.[0];
      if (embeds) {
        playembed
          .edit({
            embeds: [
              embeds.setFooter({
                text: `⛔️ SONG & QUEUE ENDED!`,
                iconURL: channel.guild.iconURL({ dynamic: true }),
              }),
            ],
            components: [client.buttons4(false),client.buttons(true), client.buttons1(true), client.buttons2(true),],
          })
          .catch(console.error);
      }
    }
  };

  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.getQueueEmbeds = async (queue) => {
    const guild = client.guilds.cache.get(queue.textChannel.guildId);
    const maxTracks = 10; // Tracks per Queue Page
    const tracks = queue.songs.slice(1); // Make a shallow copy and remove the first song

    const quelist = [];
    for (let i = 0; i < tracks.length; i += maxTracks) {
      const songs = tracks.slice(i, i + maxTracks);
      quelist.push(
        songs
          .map(
            (track, index) =>
              `\` ${i + index + 1}. \` ** ${client.getTitle(track)}** - \`${track.isLive
                ? `LIVE STREAM`
                : track.formattedDuration.split(` | `)[0]
              }\` ${track.user.globalName || track.user.username}`
          )
          .join(`\n`)
      );
    }

    const embeds = [];
    for (let i = 0; i < quelist.length; i++) {
      const desc = String(quelist[i]).substring(0, 2048);
      embeds.push(
        new EmbedBuilder()
          .setAuthor({
            name: `Queue for ${guild.name}  -  [ ${tracks.length} Tracks ]`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setColor(client.config.embed.color)
          .setDescription(desc)
      );
    }
    return embeds;
  };

  client.status = (queue) =>
    `Volume: ${queue.volume}% • Status : ${queue.paused ? "Paused" : "Playing"
    } • Loop:  ${queue.repeatMode === 2 ? `Queue` : queue.repeatMode === 1 ? `Song` : `Off`
    } •  Autoplay: ${queue.autoplay ? `On` : `Off`} `;

  // embeds
  /**
   *
   * @param {Guild} guild
   */
  client.queueembed = (guild) => {
    let embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({ name: `${client.user.username} Music Queue` })
      .setDescription("The music queue is empty.");

    return embed;
  };

  /**
   *
   * @param {Guild} guild
   */
  client.playembed = (guild) => {
    const embed = new EmbedBuilder()
      .setColor(client.config.embed.color)
      .setAuthor({
        name: "NOTHING PLAYING",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `Join the voice channel and enjoy some music!\n Just send the __**SONG LINK**__ or __**NAME**__ in this channel!\n\n[Invite Now](${client.config.links.inviteURL.replace("{id}", client.user.id)}) • [Support Server](${client.config.links.DiscordServer})`
      )
      .setImage(
        guild.banner
          ? guild.bannerURL({ size: 4096 })
          : client.config.embed.pannelIMG
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      });

    return embed;
  };

  /**
   *
   * @param {Client} client
   * @param {Guild} guild
   * @returns
   */
  client.updateembed = async (client, guild) => {
    try {
      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;
      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      // Fetch both playmsg and queuemsg simultaneously using Promise.all()
      const [playmsg, queuemsg] = await Promise.all([
        musicchannel.messages.fetch(data.pmsg).catch(() => { }),
        musicchannel.messages.fetch(data.qmsg).catch(() => { }),
      ]);

      // If either playmsg or queuemsg is not found, return
      if (!playmsg || !queuemsg) return;

      // Edit playmsg and queuemsg simultaneously using Promise.all()
      await Promise.all([
        playmsg.edit({
          embeds: [client.playembed(guild)],
          components: [client.buttons3(true),client.buttons4(false), client.buttons(true), client.buttons1(true), client.buttons2(true),],
        }),
        queuemsg.edit({ embeds: [client.queueembed(guild)] }),
      ]);
    } catch (error) {
      console.error("Error updating embed:", error);
    }
  };

  // update queue
  /**
   *
   * @param {Queue} queue
   * @returns
   */
  client.updatequeue = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;

      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;

      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let queueembed = await musicchannel.messages
        .fetch(data.qmsg)
        .catch(() => { });

      if (!queueembed) return;

      const currentSong = queue.songs[0];
      let queueString = "";
      for (let index = 1; index < Math.min(queue.songs.length, 10); index++) {
        const track = queue.songs[index];
        queueString += `\`${index}.\` **[${client.getTitle(track)}](${track.url})** \n${client.config.emoji.arrow} ${track.user.globalName || track.user.username} - \`(${track.isLive ? "LIVE STREAM" : track.formattedDuration.split(" | ")[0]
          })\`\n`;
      }

      const newQueueEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setAuthor({
          name: `${guild.name} Queue - [${queue.songs.length} Tracks]`,
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .addFields([
          {
            name: `**\`0.\` __CURRENT TRACK__**`,
            value: `**${client.getTitle(currentSong)}** \n${client.config.emoji.arrow} ${currentSong.user.globalName || currentSong.user.username} - \`(${currentSong?.isLive
              ? "LIVE STREAM"
              : currentSong?.formattedDuration.split(" | ")[0]
              })\``,
          },
        ]);

      if (queueString.length > 0) {
        newQueueEmbed.setDescription(queueString.substring(0, 2048));
      }

      await queueembed.edit({ embeds: [newQueueEmbed] });
    } catch (error) {
    }
  };

  // update player
  /**
    *
    * @param {Queue} queue
    * @returns
    */
  const ytsr = require('@distube/ytsr');
  client.updateplayer = async (queue) => {
    try {
      const guild = client.guilds.cache.get(queue.textChannel.guildId);
      if (!guild) return;

      const data = await client.music.get(`${guild.id}.music`);
      if (!data) return;

      const musicchannel = guild.channels.cache.get(data.channel);
      if (!musicchannel) return;

      let playembed = await musicchannel.messages
        .fetch(data.pmsg)
        .catch(() => { });
      if (!playembed) return;

      const track = queue.songs[0];
      const searchResults = await ytsr(track.uploader.name, { safeSearch: true, limit: 25 });
      if (!searchResults.items || searchResults.items.length === 0) {
        return ("No results found.");
      }
      let seenValues = new Set();
      let suggestionTrack = new StringSelectMenuBuilder()
        .setCustomId("suggestion")
        .setPlaceholder("Suggestion Track")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
          searchResults.items
            .filter(item => item.type === 'video')
            .map((item) => {
              let value = item.url;
              if (seenValues.has(value)) {
                return null;
              }
              seenValues.add(value);
              return {
                label: item.name.length > 100 ? item.name.slice(0, 97) + '...' : item.name,
                description: item.duration ? item.duration : "No duration available",
                emoji: client.config.emoji.musicTrack,
                value: item.url,
              };
            })
            .filter(option => option !== null)
        );
      const sugg = new ActionRowBuilder().addComponents(suggestionTrack);

      const newEmbed = new EmbedBuilder()
        .setColor(client.config.embed.color)
        .setImage(track?.thumbnail)
        .setAuthor({ name: `Now Playing ${track.uploader.name || "😏"}`, iconURL: guild.iconURL() })
        .setDescription(`**[${client.getTitle(track)}](${track.url})\nDuration: \`${track.formattedDuration}\`\nArtist: \`${track.uploader.name || "😏"}\`**\n*Requested By* <@${track.user.id}>`)
        .setFooter({
          text: `Volume: ${queue.volume}% • Status : ${queue.paused ? "Paused" : "Playing"} • Loop:  ${queue.repeatMode === 2 ? `Queue` : queue.repeatMode === 1 ? `Song` : `Off`}`
        });

      await playembed.edit({
        embeds: [newEmbed],
        components: [sugg,client.buttons4(false), client.buttons(false), client.buttons1(false), client.buttons2(false),],
      });
    } catch (error) {
    }
  };

  /**
   *
   * @param {Guild} guild
   * @returns
   */
  client.joinVoiceChannel = async (guild) => {
    try {
      const db = await client.music?.get(`${guild.id}.vc`);
      if (!db || !db.enable) return;

      if (!guild.members.me.permissions.has(PermissionFlagsBits.Connect))
        return;

      const voiceChannel = guild.channels.cache.get(db.channel);
      if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) return;

      // Join the voice channel immediately
      await client.distube.voices.join(voiceChannel);
    } catch (error) {
      console.error("Error joining voice channel:", error);
    }
  };


  /**
   *
   * @param {Song} song
   * @returns {string}
   */
  client.getTitle = (song) => {
    try {
      if (!song) return;
      const TrackTitle = song.name || song.playlist.name;

      if (!TrackTitle) return "Unknown Track";

      const title = TrackTitle.replace(/[\[\(][^\]\)]*[\]\)]/, "").trim();

      const parts = title.split("|");

      const shortTitle = parts[0].trim();

      return shortTitle.substring(0, 100);
    } catch (error) {
      console.error("Error while processing track title:", error);
      return "Unknown Track";
    }
  };
};
