const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const { splitBar } = require("string-progressbar");

module.exports = {
  name: "songinfo",
  aliases: ["nowplaying", "np", "si", "song"],
  description: "Shows details of the song currently being played.",
  category: "music",
  subCommands: ["<song number>\nShows details of a specific song in the queue."],
  async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player || !player.queue.current)
      return bot.say.ErrorMessage(message, "The bot is currently not playing.");

    const queue = player.queue;

    let song = queue.current;

    if (args[0]) {
      songNum = (Number(args[0]) - 1);

      if (isNaN(args[0]) || !queue[songNum] || songNum > queue.length || songNum < 0)
        return bot.say.ErrorMessage(message, "Provided Song Index does not exist.");

      song = queue[songNum]
    }

    if (!song.title) {
      await song.resolve()
    };

    let duration = song.duration;
    let formattedDuration = moment.duration(song.duration, "milliseconds").format();
    let formattedCurrentTime = moment.duration(player.position, "milliseconds").format();

    const seek = player.position;

    if (song.isStream) {
      duration = player.position;
      formattedDuration = "Live";
    }

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor || "#00FFFF")
      .setTitle(song.title)
      .setURL(song.uri);

    if (song === queue.current) {
      embed.setAuthor(`Now ${player.playing ? "playing" : "paused"} 🎶`)
        .setDescription(`~ Played by: ${song.requester.toString()}
${splitBar(song.duration, seek)}
[${formattedCurrentTime}\/${formattedDuration}]`);
    } else {
      embed.setAuthor("Songinfo 🎵")
        .setDescription(`~ Requested by: ${song.requester.toString()}
Duration: ${formattedDuration}
Position in queue: ${Number(args[0])}`);
    }

    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};
