module.exports = {
  name: "pause",
  aliases: ["break"],
  description: "Pauses the current playing song.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (player.paused)
      return bot.say.WarnMessage(message, "The song is already paused.");

    player.pause(true);

    return bot.say.QueueMessage(bot, player, "Paused the song.");
  }
};