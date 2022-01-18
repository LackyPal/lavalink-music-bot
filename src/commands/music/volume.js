module.exports = {
  name: "volume",
  aliases: ["vol", "v"],
  description: "Check or change the volume",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (!args[0])
      return bot.say.successMessage(message, `Volume is set at \`${player.volume} %\`.`);

    const newVol = Number(args[0]);

    if (!newVol || isNaN(newVol) || !Number.isInteger(newVol) || newVol > 200 || newVol < 0)
      return bot.say.wrongMessage(message, "Provide a valid number between 1 to 200.");

    player.setVolume(newVol);

    return bot.say.successMessage(message, `Volume is updated to \`${player.volume}%\`.`);
  }
};