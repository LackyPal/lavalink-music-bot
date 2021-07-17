module.exports = {
  name: "jump",
  aliases: ["st", "skipto"],
  description: "Jump to a specific track in the queue.",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 1)
      return bot.say.ErrorMessage(message, "There is currently no song in the queue.");

    const index = Number(args[0]);

    if (!index || index > queue.length || index < 1)
      return bot.say.ErrorMessage(message, "Provided Song Index does not exist.");

    queue.remove(0, index - 1);
    player.stop();

    return bot.say.QueueMessage(bot, player, `Skipped \`${index}\` songs.`);
  }
};