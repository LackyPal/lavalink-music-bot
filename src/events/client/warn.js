module.exports = {
  name: "warn",
  execute(bot, error) {
    return bot.util.sendErrorLog(bot, error, "warning");
  }
};