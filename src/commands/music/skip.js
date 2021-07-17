module.exports = {
  name: "skip",
  aliases: ["s", "next"],
  description: "Lets you skip the current song",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (player.queue.length < 1 && !player.get("autoplay"))
      return bot.say.WarnMessage(message, "No more songs in the queue to skip.");

    player.stop();

    return bot.say.QueueMessage(bot, player, "Skipped the song.");
  }
};
