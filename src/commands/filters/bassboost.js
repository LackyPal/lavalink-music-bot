const bb = require("../../data/bbfilters.json");

module.exports = {
  name: "bassboost",
  aliases: ["bb", "bass"],
  description: "Shows the current bassboost level",
  category: "filters",
  subCommands: ["<off | low | medium | high | extreme | earrape>**\nSets the bassboost level (off | low | medium | high | extreme | earrape)", "<boost factor>**\nSets the bassboost from 0 (min bass) to 5 (max bass)"],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;

    let bbLvl = player.get("filter");
    if (!bbLvl || !bbLvl.includes("bb")) bbLvl = "none";
    else bbLvl = bbLvl.split("bb")[1];

    if (!args.length) return bot.say.InfoMessage(message, `Bassboost level is set at \`${bbLvl}\`.`);

    const level = args[0]?.toLowerCase();

    switch (level) {
      case "none":
      case "0":
        player.setEQ(bb.none);
        player.set("filter", "bbnone");
        break;
      case "low":
      case "1":
        player.setEQ(bb.low);
        player.set("filter", "bblow");
        break;
      case "medium":
      case "2":
        player.setEQ(bb.medium);
        player.set("filter", "bbmedium");
        break;
      case "high":
      case "3":
        player.setEQ(bb.high);
        player.set("filter", "bbhigh");
        break;
      case "extreme":
      case "4":
        player.setEQ(bb.extreme);
        player.set("filter", "bbextreme");
        break;
      case "earrape":
      case "5":
        player.setEQ(bb.earrape);
        player.set("filter", "bbearrape");
        break;
      default:
        return bot.say.ErrorMessage(message, "Bass boost level must be one of the following: `none`, `low`, `medium`, `high`, `extreme`, `earrape`");
    }

    return bot.say.QueueMessage(bot, player, `Set bassboost level to \`${level}\`.`);
  }
};
