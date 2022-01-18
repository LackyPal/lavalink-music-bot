module.exports = {
  name: "trackError",
  execute(bot, player, track, payload) {
    bot.utils.sendErrorLog(bot, { stack: `Error: ${payload.error}\nType: ${payload.type}\nTrack: ${track.uri}`, name: "TRACK_ERROR" }, "error");

    return bot.say.queueMessage(bot, player, `\`${track.uri}\` got errored while playing.`);

  }
};