module.exports = {
  name: "nodeError",
  execute(bot, node, err) {
    bot.utils.sendErrorLog(bot, err, "error");
  }
};