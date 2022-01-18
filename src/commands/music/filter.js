module.exports = {
  name: "filter",
  description: "Show the current set filter.",
  cooldown: "4",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    if (!player.get("filter")) return bot.say.wrongMessage(message, "No filter is applied now.");

    if (args[0]?.toLowerCase() === "reset") {
      player.clearEQ();
      player.set("filter", null);

      return bot.say.successMessage(message, "Removed all filters.");
    } else {
      return bot.say.successMessage(message, `Current applied filter is \`${player.get("filter")}\`.`);
    }
  }
};