module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove a specific song from the queue",
  category: "music",
  subCommands: ["range <from> <to>**\nRemove a range of tracks from the queue."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    const queue = player.queue;

    if (queue.length < 1)
      return bot.say.wrongMessage(message, "There's no song to remove in the queue.");

    if (args[0]?.toLowerCase() === "range") {
      if (!args[1])
        return bot.say.wrongMessage(message, "You forgot to provide the start track index.");

      if (!args[2])
        return bot.say.wrongMessage(message, "You forgot to provide the end track index.");

      const start = Number(args[1]) - 1;
      const end = Number(args[2]) - 1;

      if (isNaN(start) || start < 0 || start > queue.length || !queue[start])
        return bot.say.wrongMessage(message, "Provided start Song Index is not valid..");

      if (isNaN(end) || end < 0 || end > queue.length || !queue[end])
        return bot.say.wrongMessage(message, "Provided end Song Index is not valid.");

      if (start >= end)
        return bot.say.wrongMessage(message, "The starting position cannot be greater than ending position.");

      const delTracks = queue.remove(start, end);

      return bot.say.successMessage(message, `Removed \`${delTracks.length}\` tracks.`);
    } else {
      if (!args[0])
        return bot.say.wrongMessage(message, "You forgot to provide the track index to remove.");

      const index = Number(args[0]) - 1;

      if (!index || isNaN(index) || index < 0 || index > queue.length || !queue[index])
        return bot.say.wrongMessage(message, "Provided Song Index does not exist.");

      const track = queue.remove(index)[0];

      return bot.say.successMessage(message, `Removed \`${track.title}\`.`);
    }
  }
};