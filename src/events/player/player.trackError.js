module.exports = {
  name: "trackError",
  execute(bot, player, track, payload) {
    bot.say.QueueMessage(bot, player, "An error occurred while playing. Sorry for the inconveniences.", "RED");
    return bot.util.sendErrorLog(bot, { stack: `Error- ${payload.error}\nType- ${payload.type}\nTrack- ${track.uri}`, name: "TRACK_ERROR" }, "error");
  }
};
