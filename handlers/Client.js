const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  User,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { filters, options } = require("../settings/config");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { YouTubePlugin } = require("@distube/youtube");
const Genius = require("genius-lyrics");
const geniusToken = require("../settings/config");
class JUGNU extends Client {
  constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
      ],
      intents: [
        GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
   // GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
      ],
      shards: "auto",
      failIfNotExists: false,
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
        users: [],
        roles: [],
        repliedUser: false,
      },
    });

    this.events = new Collection();
    this.cooldowns = new Collection();
    this.mcommands = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
    this.shuffleData = new Collection();
    this.leaveTimeoutHandles = new Collection();
    this.mcategories = fs.readdirSync("./Commands/Message");
    this.scategories = fs.readdirSync("./Commands/Slash");
    this.temp = new Collection();
    this.config = require("../settings/config");
    this.genius = new Genius.Client(geniusToken.geniusToken);
    this.distube = new Distube(this, {
      emitNewSongOnly: true, // Emit 'playSong' event only when a new song starts playing
      nsfw: false, // Enable nsfw mode for searching
      savePreviousSongs: true, // Save previous songs in the queue
      joinNewVoiceChannel: false, // Join the new voice channel when a song is played
      // Additional options
      customFilters: filters, // Use custom filters if needed
      // Plugins configuration
      plugins: [
        new YouTubePlugin(),
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
        new YtDlpPlugin(),
      ],
      /*ffmpeg: {
        path: require("ffmpeg-static"),
      },*/
    });
  }

  start(token) {
    [
      "handler",
      "DistubeEvents",
      "RequestChannel",
      "DistubeHandler",
      "utils",
    ].forEach((handler) => {
      require(`./${handler}`)(this);
    });
    this.login(token);
  }
  /**
   *
   * @param {User} user
   * @returns
   */
  getFooter(user) {
    const obj = {
      text: `Requested By ${user.username||user.tag}`,
      iconURL: user.displayAvatarURL(),
    };

    return options.embedFooter ? obj : null;
  }

  embed(interaction, data) {
    let user = interaction.user ? interaction.user : interaction.author;
    if (interaction.deferred) {
      interaction
        .followUp({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    } else {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor(this.config.embed.color)
              .setDescription(`${data.substring(0, 3000)}`)
              .setFooter(this.getFooter(user)),
          ],
        })
        .catch((e) => {});
    }
  }
}

module.exports = JUGNU;
