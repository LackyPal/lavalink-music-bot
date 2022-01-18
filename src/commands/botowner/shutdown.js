module.exports = {
  name: "shutdown",
  description: "Shuts the bot down",
  category: "botowner",
  ownerOnly: true,
  async execute(bot, message) {
    await bot.say.successMessage(message, "Shutting the bot down.....");

    process.exit(1);
  }
};