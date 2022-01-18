module.exports = {
  name: "queueEnd",
  async execute(bot, player, track) {
    const voiceChannel = bot.channels.cache.get(player.voiceChannel);

    if (!player.get("autoplay")) {
      await player.destroy();

      return bot.say.queueMessage(bot, player, "No more songs to play. Left the voice channel.");

    } else {
      const mixURL = `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`;
      const result = await player.search(mixURL, bot.user).catch(() => null);

      if (!result || result.loadType === "LOAD_FAILED" || result.loadType !== "PLAYLIST_LOADED") {
        await player.destroy();

        return bot.say.queueMessage(bot, player, "Music stopped. No related song was found.");
      }

      player.queue.add(result.tracks[1]);
      return player.play();
    }
  }
};