module.exports = {
  name: "resume",
  aliases: ["continue"],
  description: "Resumes the current paused song.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (!player.paused)
      return bot.say.WarnMessage(message, "The song is not paused.");

    player.pause(false);

    return bot.say.QueueMessage(bot, player, "Resumed the song.");
  }
};