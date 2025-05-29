const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const JUGNU = require("../../../handlers/Client");

module.exports = {
  name: "loguserid",
  description: `Log the user ID who used this command`,
  userPermissions: PermissionFlagsBits.ManageChannels,
  botPermissions: PermissionFlagsBits.ManageChannels,
  category: "Utilities",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    // احصل على ID الشخص الذي كتب الأمر
    const userId = interaction.user.id;

    // تسجيل ID في وحدة البيانات
    await client.playlist.set(`${userId}.list`, []);

    // رد على المستخدم لتأكيد تسجيل الـ ID
    return interaction.followUp({
      content: `✅ Successfully logged your ID: \`${userId}\``,
      ephemeral: true, // الرد خاص
    });
  },
};
