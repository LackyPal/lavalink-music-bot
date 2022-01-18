module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Play a song or playlist from url or name",
  category: "music",
  cooldown: "4",
  usage: "<song url/name> [flags]",
  async execute(bot, message, args) {
    let query = args.join(" ");

    const flag = args[args.length - 1]?.toLowerCase();
    let position = undefined;

    if (flag === "--next" || flag === "--skip") {
      query = args.slice(0, -1).join(" ");;
      position = 0;
    }

    if (!query)
      return bot.say.wrongMessage(message, "No song name or url provided!");

    let player = bot.manager.get(message.guild.id);

    const channel = message.member?.voice.channel;

    if (!channel)
      return bot.say.wrongMessage(message, "You have to join a voice channel first.");

    if (player) {
      if (channel.id !== player.voiceChannel)
        return bot.say.wrongMessage(message, "I'm already playing in a different voice channel!");

    } else {
      if (!channel.viewable)
        return bot.say.wrongMessage(message, "I need \`View Channel\` permission.");

      if (!channel.joinable)
        return bot.say.wrongMessage(message, "I need \`Connect Channel\` permission.");

      if (!channel.speakable)
        return bot.say.wrongMessage(message, "I need \`Speak\` permission.");

      if (channel.full)
        return bot.say.wrongMessage(message, "Can't join, the voice channel is full.");
    }

    if (message.member.voice.deaf)
      return bot.say.wrongMessage(message, "You cannot run this command while deafened.");

    if (message.guild.me?.voice?.mute)
      return bot.say.wrongMessage(message, "Please unmute me before playing.");

    if (!player) player = bot.manager.create({
      guild: message.guild.id,
      voiceChannel: channel.id,
      textChannel: message.channel.id,
      selfDeafen: true
    });

    const queue = player.queue;

    if (player.state !== "CONNECTED") await player.connect();

    const result = await player.search(query, message.author);

    switch (result.loadType) {
      case "LOAD_FAILED":
      case "NO_MATCHES":
        if (!queue.current) player.destroy();

        return bot.say.wrongMessage(message, "No result was found.");
        break;

      case "PLAYLIST_LOADED":
        const plTracks = result.tracks;
        queue.add(plTracks, position);

        bot.say.successMessage(message, `${ plTracks.length} tracks queued from: \`${result.playlist.name}\``);

        if (!player.playing && !player.paused && queue.totalSize === plTracks.length)
          return await player.play();

        if (flag === "--skip")
          return await player.stop();
        break;

      default:
        //  case "TRACK_LOADED":
        //  case "SEARCH_RESULT":
        const track = result.tracks[0];
        queue.add(track, position);

        if (!player.playing && !player.paused && !queue.size)
          return await player.play();

        if (type === "--skip")
          return await player.stop();


        const embed = bot.say.baseEmbed(message)
          .setTitle(`Track queued - Position ${queue.indexOf(track) + 1}`)
          .setDescription(`[${track.title}](${track.uri}) ~ [${message.author.toString()}]`);

        return message.reply({ embeds: [embed] }).catch(console.error);
    }
  }
};