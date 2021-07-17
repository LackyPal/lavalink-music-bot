module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove a specific song from the queue",
  category: "music",
  subCommands: ["range <from> <to>**\nRemove a range of tracks from the queue."],
  async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 1)
      return bot.say.WarnMessage(message, "There's no song to remove in the queue.");

    if (!args[0])
      return bot.say.WarnMessage(message, "You forgot the track id to remove.");

    if (args[0]?.toLowerCase() === "range") {
      if (!args[1] || !args[2] || isNaN(args[1]) || isNaN(args[2]))
        return bot.say.WarnMessage(message, "Please provide valid Song Index.");

      let start = (Number(args[1]) - 1);
      let end = (Number(args[2]) - 1);

      if (start < 0 || end < 0 || start > queue.length || !queue[start] || end > queue.length || !queue[end])
        return bot.say.WarnMessage(message, "Please provide valid Song Index.");

      if (start >= end)
        return bot.say.WarnMessage(message, "The starting position cannot greater than ending position.");

      const delTracks = queue.remove(start, end);

      return bot.say.QueueMessage(bot, player, `Removed \`${delTracks.length}\` tracks.`);
    } else {
      const index = (Number(args[0]) - 1);

      if (isNaN(args[0]) || !index || index < 0 || index > queue.length || !queue[index])
        return bot.say.WarnMessage(message, "Provided Song Index does not exist.");

      queue.remove(index);

      return bot.say.QueueMessage(bot, player, `Removed track \`${args[1]}\`.`);
    }
  }
};
