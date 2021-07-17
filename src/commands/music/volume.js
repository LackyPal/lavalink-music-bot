module.exports = {
  name: "volume",
  aliases: ["vol", "v"],
  description: "Shows the current volume",
  category: "music",
  subCommands: ["<1-200>**\nLets you change the bots output volume."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (!args[0])
      return bot.say.InfoMessage(message, `Volume is at \`${player.volume}%\`.`);

    const newVol = Number(args[0]);

    if (!newVol || isNaN(newVol) || !Number.isInteger(newVol) || newVol > 200 || newVol < 0)
      return bot.say.WarnMessage(message, "Provide a valid number between 1 to 200.");

    player.setVolume(newVol);

    return bot.say.QueueMessage(bot, player, `Volume is updated to \`${player.volume}%\`.`);
  }
};
