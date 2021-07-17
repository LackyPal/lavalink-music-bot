module.exports = {
  name: "clear",
  aliases: ["c", "empty"],
  description: "Clears the current queue.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (queue.length < 1)
      return bot.say.WarnMessage(message, "There is currently no song in the queue.");

    player.queue.clear();

    return bot.say.QueueMessage(bot, player, "The queue has been cleared.");
  }
};