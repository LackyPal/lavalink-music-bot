module.exports = {
  name: "loop",
  aliases: ["repeat", "lp"],
  description: "Shows current set loop mode",
  category: "music",
  subCommands: ["queue**\nLoop the queue.", "song**\nRepeat the current playing song.", "off**\nTurn looping off."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    if (!bot.utils.modifyQueue(message)) return;

    const option = args[0]?.toLowerCase();

    switch (option) {
      case "off":
      case "stop":
        player.set("repeatMode", 0);
        player.setQueueRepeat(false);
        player.setTrackRepeat(false);
        break;

      case "song":
      case "track":
      case "current":
        player.set("repeatMode", 1);
        player.setQueueRepeat(false);
        player.setTrackRepeat(true);
        break;

      case "queue":
      case "all":
        player.set("repeatMode", 2);
        player.setQueueRepeat(true);
        player.setTrackRepeat(false);
        break;

      default:
        const embed = bot.say.baseEmbed(message)
          .setDescription(
            `Loop mode is set to: \`${player.get("repeatMode") ? player.get("repeatMode") == 2 ? "queue" : "song": "off"}\`.`
          )
          .setFooter({ text: `Please use '${bot.config.PREFIX}loop <off|song|queue>' to change loop mode.` });

        return message.reply({ embeds: [embed] }).catch(console.error);
    }

    return bot.say.successMessage(message,
      `${player.get("repeatMode") ? player.get("repeatMode") == 2 ? "Looping queue is activated." : "Repeating song is activated." : "Turned off looping."}`
    );
  },
};