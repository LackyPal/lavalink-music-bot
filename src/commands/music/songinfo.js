const { splitBar } = require("string-progressbar");

module.exports = {
  name: "songinfo",
  aliases: ["nowplaying", "np", "si", "song"],
  description: "Shows details of currently playing song.",
  category: "music",
  subCommands: ["<song number>\nShows details of a specific song in the queue."],
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player || !player.queue.current)
      return bot.say.wrongMessage(message, "The bot is currently not playing in this server.");

    const queue = player.queue;

    let song = queue.current;

    if (args[0]) {
      songNum = Number(args[0]) - 1;

      if (isNaN(args[0]) || !queue[songNum] || songNum > queue.length || songNum < 0)
        return bot.say.wrongMessage(message, "Provided Song Index does not exist.");

      song = queue[songNum]
    }

    let duration = song.duration;
    let formattedDuration = bot.utils.fotmatDuration(song.duration);
    let formattedCurrentTime = bot.utils.fotmatDuration(player.position);

    const seek = player.position;

    if (song.isStream) {
      duration = player.position;
      formattedDuration = "Live";
    }

    const embed = bot.say.baseEmbed()
      .setTitle(song.title)
      .setURL(song.uri);

    if (song === queue.current) {
      embed.setAuthor({ name: `Now ${player.playing ? "playing" : "paused"} 🎶` })
        .setDescription(`~ Played by: ${song.requester.toString()}
${splitBar(song.duration, seek)}
[${formattedCurrentTime}\/${formattedDuration}]`);
    } else {
      embed.setAuthor({ name: "Songinfo 🎵" })
        .setDescription(`~ Requested by: ${song.requester.toString()}
Duration: ${formattedDuration}
Position in queue: ${Number(args[0])}`);
    }

    return message.reply({ embeds: [embed] }).catch(console.error);
  }
};