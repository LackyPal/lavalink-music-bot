const levels = {
  off: 0.0,
  low: 0.20,
  medium: 0.45,
  high: 0.70,
  extreme: 1.0,
  earrape: 1.5
};

module.exports = {
  name: "bassboost",
  aliases: ["bb", "bass"],
  description: "Change or check the bassboost level",
  usage: "[level]",
  category: "filters",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    let bbLvl = player.get("filter");
    if (!bbLvl || !bbLvl.includes("bb")) bbLvl = "none";
    else bbLvl = bbLvl.split("bb")[1];

    const value = args[0]?.toLowerCase();

    if (!args.length || !levels[value])
      return bot.say.successMessage(message, `Bassboost level is set at \`${bbLvl}\`.`);

    player.node.send({
      op: "filters",
      guildId: message.guild.id,
      equalizer: [
        ...Array(6).fill(0).map((n, i) => ({ band: i, gain: levels[value] })),
        ...Array(9).fill(0).map((n, i) => ({ band: i + 6, gain: 0 }))
      ]
    });

    player.set("filter", value === "off" ? null : `bb_${value}`);

    return bot.say.successMessage(message, value === "off" ? "Disabled the bassboost filter." : `Bassboost level set to \`${value}\`.`);
  }
};