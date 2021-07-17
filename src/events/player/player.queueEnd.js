module.exports = {
  name: "queueEnd",
  async execute(bot, player, track) {
    const voiceChannel = bot.channels.cache.get(player.voiceChannel);

    if (!player.get("autoplay")) {
        await player.destroy();
        return bot.say.QueueMessage(bot, player, "No more songs to play. Left the voice channel.", "ORANGE");
    } else if (player.get("autoplay")) {
      const mixURL = `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`;
      const result = await player.search(mixURL, bot.user);

      if (!result || result.loadType === "LOAD_FAILED" || result.loadType !== "PLAYLIST_LOADED") {
        bot.say.QueueMessage(bot, player, "Music stopped. No related song was found.", "ORANGE");
        return player.destroy();
      }
      player.queue.add(result.tracks[1]);
      return player.play();
    }
  }
};
