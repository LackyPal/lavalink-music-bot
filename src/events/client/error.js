module.exports = {
  name: "error",
  execute(bot, error) {
    return bot.util.sendErrorLog(bot, error, "error");
  }
};