module.exports = {
  name: "replay",
  aliases: ["rp", "restart"],
  description: "Replay the song from begging.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    player.seek(0);

    return bot.say.successMessage(message, "Restarted the current song.");
  }
};