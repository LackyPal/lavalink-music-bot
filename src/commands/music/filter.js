module.exports = {
  name: "filter",
  description: "Show the current set filter.",
  cooldown: "4",
  category: "music",
  subCommands: ["reset**\nResets all filters."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    if (!player.get("filter")) return bot.say.WarnMessage(message, "No filter is applied now.");

    if (args[0]?.toLowerCase() === "reset") {
      player.clearEQ();
      player.set("filter", undefined);
      return bot.say.QueueMessage(bot, player, "Removed all filters.");
    } else {
      return bot.say.QueueMessage(bot, player, `Current applied filter \`${player.get("filter")}\`.`);
    }
  }
};
