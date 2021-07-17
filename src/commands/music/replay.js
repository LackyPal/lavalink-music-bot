module.exports = {
  name: "replay",
  aliases: ["rp", "restart"],
  description: "Replay the current song.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    player.seek(0);

    return bot.say.QueueMessage(bot, player, "Restarted the current song.");
  }
};
