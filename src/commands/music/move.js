module.exports = {
  name: "move",
  aliases: ["mv"],
  description: "Move the selected song to the provided position in the queue",
  category: "music",
  subCommands: ["<song number>**\nMove the selected song to the top of the queue.", "last**\nMove the last track in the queue to the top"],
  async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    const queue = player.queue;

    if (!bot.canModifyQueue(message)) return;

    if (queue.length < 3)
      return bot.say.WarnMessage(message, "Need at least \`3\` songs in the queue to use this command.");

    if (!args[0])
      return bot.say.WarnMessage(message, "You forgot the track id to move.");

    let fromPos = args[0];
    let toPos = args[1] -1;
    if (!toPos) toPos = 0;

    if (args[0]?.toLowerCase() === "top") {
      fromPos = args[1] -1;
      toPos = 0;
    }

    if (fromPos?.toLowerCase() === "last") {
      fromPos = queue.length - 1;
      toPos = 0;
    }


    if (!fromPos || !toPos || isNaN(fromPos) || isNaN(toPos))
      return bot.say.WarnMessage(message, "Provided Song Index does not exist.");

    const fr = Number(fromPos);
    const to = Number(toPos);

    if (!fr || !to || fr < 0 || to < 0 || fr > queue.length || !queue[fr] || to > queue.length || !queue[to])
      return bot.say.WarnMessage(message, "Provided Song Index does not exist.");

    if (fr === to)
      return bot.say.WarnMessage(message, "The song is already in this position.");

    const song = queue[fr];
    queue.splice(fr, 1);
    queue.splice(to, 0, song);

    return bot.say.QueueMessage(bot, player, `**[${song.title}](${song.uri})** has been moved to the **position ${to}** in the queue.`);
  }
};
