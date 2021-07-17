const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "trackStart",
  async execute(bot, player, track) {
    const channel = await bot.channels.cache.get(player.textChannel);

    const embed = new MessageEmbed()
      .setTitle("Now playing")
      .setColor(channel.guild.me.displayColor || "#00FFFF")
      .setDescription(`[${track.title}](${track.uri}) ~ [${track.requester.toString()}]`);

    return channel.send({ embeds: [embed] });
  }
};
