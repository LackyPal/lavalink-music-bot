module.exports = {
  name: "shuffle",
  aliases: ["sh"],
  description: "Shuffle the queue.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 3)
      return bot.say.WarnMessage(message, "Need at least \`3\` songs in the queue to shuffle.");

    queue.shuffle();

    return bot.say.QueueMessage(bot, player, "Shuffled the queue.");
  }
};
