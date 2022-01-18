module.exports = {
  name: "skip",
  aliases: ["s", "next"],
  description: "Lets you skip the current song",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (player.queue.length < 1 && !player.get("autoplay"))
      return bot.say.wrongMessage(message, "No more songs in the queue to skip.");

    player.stop();

    return bot.say.successMessage(message, "Skipped the song.");
  }
};
