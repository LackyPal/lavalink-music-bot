module.exports = {
  name: "back",
  aliases: ["prev", "previous"],
  description: "Back to the previous song",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    const track = player.queue.previous;

    if (!track)
      return bot.say.wrongMessage(message, "No previous track was found.");

    player.queue.add(track, 0);
    player.stop();

    return bot.say.successMessage(message, "Backed to the previous song.");
  }
};