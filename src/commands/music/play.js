module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Play a song or playlist from url or name",
  category: "music",
  cooldown: "4",
  usage: " [flags] <song url/name>",
  subCommands: ["next <song url/name>**\nEnqueue the provided song to the top.", "skip <song url/name>**\nSkip and play the provided song instantly."],
  async execute(bot, message, args) {
    let string = args.join(" ");

    if (!string)
      return bot.say.ErrorMessage(message, "No song name or url provided!");

    let type = args[0]?.toLowerCase();
    let position = undefined;

    if (type === "next" || type === "skip") {
      string = args.slice(1).join(" ");
      position = 0;
    }

    const guildPlayer = bot.manager.get(message.guild.id);

    const channel = message.member?.voice.channel;

    if (!channel)
      return bot.say.WarnMessage(message, "You have to join a voice channel first.");

    if (guildPlayer && channel.id !== guildPlayer?.voiceChannel)
      return bot.say.WarnMessage(message, "I'm already playing in a different voice channel!");

    if (!channel?.viewable)
      return bot.say.WarnMessage(message, "I need **\`VIEW_CHANNEL\`** permission.");
    if (!channel?.joinable)
      return bot.say.WarnMessage(message, "I need **\`CONNECT_CHANNEL\`** permission.");
    if (!channel?.speakable)
      return bot.say.WarnMessage(message, "I need **\`SPEAK\`** permission.");

    try {
      let player;
      if (guildPlayer) player = guildPlayer;
      else player = bot.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        selfDeafen: true
      });

      const queue = player.queue;

      if (player.state !== "CONNECTED") await player.connect();
      let result = await player.search(string, message.author);
      if (result.loadType === "LOAD_FAILED") {
        if (!queue.current) player.destroy();
        bot.say.ErrorMessage(message, "No result was found.");
        return bot.logger.error("SEARCH_FAILED", result.exception.message || result.exception)
      }

      switch (result.loadType) {
        case "NO_MATCHES":
          if (!queue.current) player.destroy();
          return bot.say.ErrorMessage(message, "No result was found.");
          break;
        case "PLAYLIST_LOADED":
          const plTracks = result.tracks;
          queue.add(plTracks, position);

          bot.say.InfoMessage(message, `${ plTracks.length} tracks queued from: \`${result.playlist.name}\``);
          if (!player.playing && !player.paused && queue.totalSize === plTracks.length) return await player.play();
          if (type === "skip") return await player.stop();
          break;
        default:
          //  case "TRACK_LOADED":
          //  case "SEARCH_RESULT":
          const track = result.tracks[0];
          queue.add(track, position);

          if (!player.playing && !player.paused && !queue.size) return await player.play();

          if (type === "skip") return await player.stop();

          if (queue.size >= 0) {
            const embed = bot.say.RootEmbed(message)
              .setTitle(`Track queued - Position ${queue.indexOf(track) + 1}`)
              .setDescription(`[${track.title}](${track.uri}) ~ [${message.author.toString()}]`);
            return message.channel.send({ embeds: [embed] }).catch(console.error);
          }
      }
    } catch (e) {
      bot.logger.error("PLAY", e?.stack || e);
    }
  }
};
