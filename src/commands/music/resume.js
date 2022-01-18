module.exports = {
  name: "resume",
  aliases: ["continue", "unpause"],
  description: "Resume the paused song.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (!player.paused)
      return bot.say.wrongMessage(message, "The song is not paused.");

    player.pause(false);

    return bot.say.successMessage(message, "Resumed the song.");
  }
};