module.exports = {
  name: "jump",
  aliases: ["st", "skipto"],
  description: "Jump to a specific track in the queue.",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 1)
      return bot.say.wrongMessage(message, "There is currently no song in the queue.");

    const index = Number(args[0]);

    if (!index || !queue[index] || index > queue.length || index < 1)
      return bot.say.wrongMessage(message, "Provided Song Index does not exist.");

    player.stop(index);

    return bot.say.successMessage(message, `Skipped \`${index}\` songs.`);
  }
};
