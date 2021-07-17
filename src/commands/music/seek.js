module.exports = {
  name: "seek",
  description: "Seeks to a specific position in the current song.",
  category: "music",
   async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    const song = player.queue.current;

    if (!song.isSeekable)
      return bot.say.WarnMessage(message, "Can't seek this song.");

    if (!args[0] || isNaN(args[0]) && !args[0].includes(":"))
      return bot.say.ErrorMessage(message, "Provide a valid time to seek.");

    let timeString = args[0];
    if (!isNaN(timeString)) timeString = `00:${timeString}`;

    let time = bot.util.toTimeMilliSeconds(timeString);
    if (time === song.duration) time = song.duration - 1;

    if (!time || isNaN(time) || time >= song.duration || time < 0)
      return bot.say.WarnMessage(message, "Please provide a valid duration to seek.");

    player.seek(time);

    return bot.say.QueueMessage(bot, player, `Seeked to \`${timeString}\`.`);
  }
};
