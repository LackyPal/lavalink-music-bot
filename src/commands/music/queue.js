module.exports = {
  name: "queue",
  aliases: ["q", "list"],
  description: "Shows the queue.",
  cooldown: "4",
  category: "music",
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    const queue = player.queue;

    if (!queue.length)
      return bot.say.wrongMessage(message, "There is no song in the queue.");

    const multiple = 10;
    let page = Number(args) || 1;

    const maxPages = Math.ceil(queue.length / multiple);

    if (page < 1 || page > maxPages) page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    const embed = bot.say.baseEmbed(message)
      .setDescription(
        `${tracks.map((song, i) => `${start + (++i)} - [${song.title}](${song.uri}) ~ [${song.requester.toString()}]`).join("\n")}`
      )
      .setFooter({
        text: `Page ${page} of ${maxPages} | song ${start + 1} to ${end > queue.length ? `${queue.length}` : `${end}`} of ${queue.length}`,
        iconURL: message.member.displayAvatarURL({ dynamic: true })
      });

    return message.reply({ embeds: [embed] }).catch(console.error);
  }
};