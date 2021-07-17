const Genius = require("genius-lyrics");

module.exports = {
  name: "lyrics",
  aliases: ["ly", "lyric"],
  description: "Shows lyrics for the currently playing song.",
  cooldown: "4",
  category: "music",
  subCommands: ["<song title>**\nShows lyrics for the provided song."],
  async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!args.length && !player)
      return bot.say.ErrorMessage(message, "You forgot the song name to search lyrics.");

    const songName = args.join(" ") || player.queue.current.title;

    const songNameFormated = songName
      .toLowerCase()
      .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "");

    const srMsg = await bot.say.InfoMessage(message, `🔍 Searching lyrics for \`${songName}\``);

    const GeniusLyrics = new Genius.Client(bot.env.geniusApiKey);

    const results = await GeniusLyrics.songs.search(`${songNameFormated}`).catch(err => {
        bot.logger.error("LYRICS", err);
      });

    if (!results) {
      srMsg.delete();
      return bot.say.ErrorMessage(message, "Sorry, No lyrics were found for this song.....");
    }

    const lyrics = await results[0].lyrics();

    const embed = new bot.say.BaseEmbed(message)
      .setTitle(`${songName}`)
      .setDescription(`${lyrics.slice(0, 4090)}...`);

    srMsg.delete();
    return message.channel.send({ embeds: [embed] }).catch(console.error);
  }
};
