module.exports = {
  name: "stop",
  description: "Stops the player and clears the queue.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    player.destroy();

    return bot.say.QueueMessage(bot, player, "Music stopped. Left the voice channel.");
  }
};
