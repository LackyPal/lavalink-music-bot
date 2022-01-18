module.exports = {
  name: "move",
  aliases: ["mv"],
  description: "Move the selected song to the provided position in the queue",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    const queue = player.queue;

    if (!bot.utils.modifyQueue(message)) return;

    if (queue.length < 3)
      return bot.say.wrongMessage(message, "Need at least \`3\` songs in the queue to use this command.");

    if (!args[0])
      return bot.say.wrongMessage(message, "You forgot to provide the track index.");

    if (!args[1])
      return bot.say.wrongMessage(message, "You forgot to provide the new position.");

    const from = Number(args[0]) - 1;
    const to = Number(args[1]) - 1;

    if (!from || isNaN(from) || from < 0 || from > queue.length || !queue[from])
      return bot.say.wrongMessage(message, "Provided Song Index does not exist.");

    if (!to || isNaN(to) || to < 0 || to > queue.length || !queue[to])
      return bot.say.wrongMessage(message, "Provided position does not exist.");

    if (from === to)
      return bot.say.wrongMessage(message, "The song is already in this position.");

    const song = queue.splice(from, 1)[0];
    queue.splice(to, 0, song);

    return bot.say.successMessage(message, `**[${song.title}](${song.uri})** is moved to the **position ${to}** in the queue.`);
  }
};