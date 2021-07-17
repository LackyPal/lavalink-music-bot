module.exports = {
  name: "autoplay",
  aliases: ["ap", "auto"],
  description: "Toggle the bot to continuously queue up recommended songs.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    player.set("autoplay", !player.get("autoplay"));

    return bot.say.QueueMessage(bot, player, `Turned \`${player.get("autoplay") ? "on" : "off"}\` autoplay mode.`);
  }
};
