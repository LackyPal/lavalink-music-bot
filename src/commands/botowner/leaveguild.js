module.exports = {
  name: "leaveguild",
  description: "Leaves a guid by the provided Id",
  category: "botowner",
  ownerOnly: true,
  async execute(bot, message, args) {
    const guildId = args[0];

    if (!guildId)
      return bot.say.wrongMessage(message, "You forgot to provide the guild id.");

    const guild = bot.guilds.cache.get(guildId);

    if (!guild)
      return bot.say.wrongMessage(message, "That guild was not found");

    await guild.leave();

    return bot.say.successMessage(message, `Left **${guild.name}** guild`);
  }
};