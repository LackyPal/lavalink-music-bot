module.exports = {
  name: "trackStuck",
  execute(bot, player, track, payload) {
    bot.utils.sendErrorLog(bot, { stack: `Error: ${payload.error}\nType: ${payload.type}\nTrack: ${track.uri}`, name: "TRACK_STUCK" }, "error");

    return bot.say.queueMessage(bot, player, `\`${track.uri}\` got stucked while playing.`);

  }
};