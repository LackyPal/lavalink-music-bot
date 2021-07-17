module.exports = {
  name: "queue",
  aliases: ["q", "list"],
  description: "Shows the queue.",
  cooldown: "4",
  category: "music",
  subCommands: ["<page number>**\nShow a specific page of the queue."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    const queue = player.queue;

    if (!queue.length)
      return bot.say.WarnMessage(message, "There is currently no song in the queue.");

    const multiple = 10;
    let page = Number(args) || 1;

    const maxPages = Math.ceil(queue.length / multiple);

    if (page < 1 || page > maxPages) page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    const embed = bot.say.RootEmbed(message)
      .setDescription(`${tracks.map((song, i) => `${start + (++i)} - [${song.title}](${song.uri}) ~ [${song.requester.toString()}]`).join("\n")}`)
      .setFooter(`Page ${page} of ${maxPages} | song ${start + 1} to ${end > queue.length ? `${queue.length}` : `${end}`} of ${queue.length}`, message.author.displayAvatarURL({ dynamic: true }));

    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};