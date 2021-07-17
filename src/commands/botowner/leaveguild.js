module.exports = {
  name: "leaveguild",
  description: "Leaves a guid by the provided Id",
  category: "botowner",
  ownerOnly: true,
  async execute(bot, message, args) {
    const guildId = args[0];

    if (!guildId)
      return bot.say.WarnMessage(message, "You forgot the guild id.");

    const guild = bot.guilds.cache.find((g) => g.id === guildId);

    if (!guild) {
      return bot.say.WarnMessage(message, "That guild was not found");
    }

    try {
      await guild.leave();
      bot.say.InfoMessage(message, `Left **${guild.name}** guild`);
    } catch (e) {
      bot.util.sendErrorLog(bot, e, "error");
      return bot.say.WarnMessage(message, "An error occurred.");
    }
  }
};
