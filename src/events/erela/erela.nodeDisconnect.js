module.exports = {
  name: "nodeDisconnect",
  execute(bot, node, reason) {
    bot.utils.sendErrorLog(bot, reason, "error");
  }
};