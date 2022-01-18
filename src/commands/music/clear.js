module.exports = {
  name: "clear",
  aliases: ["cq", "empty"],
  description: "Clear the current queue.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (queue.length < 1)
      return bot.say.wrongMessage(message, "There is currently no song in the queue.");

    player.queue.clear();

    return bot.say.successMessage(message, "The queue has been cleared.");
  }
};