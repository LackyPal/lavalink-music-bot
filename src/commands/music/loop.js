module.exports = {
  name: "loop",
  aliases: ["repeat", "lp"],
  description: "Shows current loop mode",
  category: "music",
  subCommands: ["queue**\nLoop the queue.", "song**\nRepeat the current playing song.", "off**\nTurn looping off."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    if (!bot.canModifyQueue(message)) return;
    const embed = bot.say.RootEmbed(message)
      .setDescription(`Loop mode is set to: \`${player.get("repeatMode") ? player.get("repeatMode") == 2 ? "queue" : "song": "off"}\`.`)
      .setFooter(`Please use '${bot.env.prefix}loop <off|song|queue>' to change loop mode.`);

    if (!args.length)
      return message.channel.send({ embeds: [embed] }).catch(console.error);

    const option = args[0]?.toLowerCase();
    switch (option) {
      case "off":
        player.set("repeatMode", 0);
        player.setQueueRepeat(false);
        player.setTrackRepeat(false);
        break;
      case "song":
        player.set("repeatMode", 1);
        player.setQueueRepeat(false);
        player.setTrackRepeat(true);
        break;
      case "queue":
        player.set("repeatMode", 2);
        player.setQueueRepeat(true);
        player.setTrackRepeat(false);
        break;
      default:
        return message.channel.send({ embeds: [embed] }).catch(console.error);
    }
    return bot.say.QueueMessage(bot, player, `${player.get("repeatMode") ? player.get("repeatMode") == 2 ? "Looping queue is activated." : "Repeating song is activated." : "Turned off looping."}`);
  },
};