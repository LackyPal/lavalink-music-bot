const Genius = require("genius-lyrics");

module.exports = {
  name: "lyrics",
  aliases: ["ly", "lyric"],
  description: "Shows lyrics for a song.",
  cooldown: "4",
  category: "music",
  async execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    const songName = args.join(" ") || player?.queue?.current?.title;

    if (!songName)
      return bot.say.wrongMessage(message, "You forgot to provide the song name.");

    const songNameFormated = songName
      .toLowerCase()
      .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "");

    const msg = await bot.say.successMessage(message, `🔍 Searching lyrics for \`${songName}\``);

    const GeniusLyrics = new Genius.Client();

    const results = await GeniusLyrics.songs.search(`${songNameFormated}`).catch(() => null);

    if (!results) {
      msg.delete();

      return bot.say.wrongMessage(message, "Sorry, No lyrics were found for this song.....");
    }

    const lyrics = await results[0].lyrics();

    const embed = new bot.say.baseEmbed(message)
      .setTitle(`${songName}`)
      .setDescription(`${lyrics.slice(0, 4090)}...`);

    msg.delete();

    return message.reply({ embeds: [embed] }).catch(console.error);
  }
};