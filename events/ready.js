const { ActivityType } = require("discord.js");
const client = require("../index");
const { registerSlashCommands } = require("../handlers/functions");
const server = require("../server.js");
const Database = require("../handlers/Database");

client.once("ready", async () => {
  try {
    console.log(`${client.user.username} is Online`);

    // Set bot activity
    client.user.setActivity({
      name: `🛠️ Queen`,
      //name: `${client.config.PREFIX}help | SlashCommands`,
      type: ActivityType.Custom,
    });
    
    client.user.setStatus("dnd")

    // Load database
    await Database(client);

    // Reset music embeds for all guilds one by one
    for (const guild of client.guilds.cache.values()) {
      await client.updateembed(client, guild);
    }

    // Register slash commands
    await registerSlashCommands(client);

    // Load dashboard
    await server(client);
  } catch (error) {
    console.error("An error occurred during initialization:", error);
  }
});
