module.exports = {
  name: "shuffle",
  aliases: ["sf", "mix"],
  description: "Shuffle the queue.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 3)
      return bot.say.wrongMessage(message, "Need at least \`3\` songs in the queue to shuffle.");

    queue.shuffle();

    return bot.say.successMessage(message, "Shuffled the queue.");
  }
};