module.exports = {
  name: "stop",
  description: "Stop playing and leave the voice channel",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    player.destroy();

    return bot.say.successMessage(message, "Music stopped. Left the voice channel.");
  }
};