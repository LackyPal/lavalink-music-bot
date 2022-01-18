module.exports = {
  name: "trackStart",
  execute(bot, player, track) {
    const channel = bot.channels.cache.get(player.textChannel);

    if (!channel) return;

    const embed = bot.say.baseEmbed(channel)
      .setTitle("Now playing")
      .setDescription(`[${track.title}](${track.uri}) ~ [${track.requester.toString()}]`);

    return channel.send({ embeds: [embed] });
  }
};