module.exports = {
  name: "raw",
  execute(bot, d) {
    bot.manager.updateVoiceState(d);
  }
};
