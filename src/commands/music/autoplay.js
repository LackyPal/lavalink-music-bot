module.exports = {
  name: "autoplay",
  aliases: ["ap", "auto"],
  description: "Toggle to autoplay recommended songs.",
  category: "music",
  execute(bot, message) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    player.set("autoplay", !player.get("autoplay"));

    return bot.say.successMessage(message, `**${player.get("autoplay") ? "Enabled" : "Disabled"}** autoplay mode.`);
  }
};