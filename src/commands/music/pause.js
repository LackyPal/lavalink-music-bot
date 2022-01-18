module.exports = {
  name: "pause",
  aliases: ["break", "hold"],
  description: "Pause the playing song.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (player.paused)
      return bot.say.wrongMessage(message, "The song is already paused.");

    player.pause(true);

    return bot.say.successMessage(message, "Paused the song.");
  }
};