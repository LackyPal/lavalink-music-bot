module.exports = {
  name: "back",
  aliases: ["prev", "previous"],
  description: "Backs to the previous song",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    const track = player.queue.previous;

    if (!track)
      return bot.say.WarnMessage(message, "No previous track was found.");

    player.queue.add(track, 0);
    player.stop();

    return bot.say.QueueMessage(bot, player, "Backed to the previous song.");
  }
};
