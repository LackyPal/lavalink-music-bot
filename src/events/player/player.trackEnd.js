module.exports = {
  name: "trackEnd",
  execute(bot, player, track) {
  const queueTracks = player.get("previousQueue");
  queueTracks.push(track);
  player.set("previousQueue", queueTracks);
  }
};
