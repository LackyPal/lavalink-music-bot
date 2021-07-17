const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  description: "show the bot response speed",
  cooldown: "4",
  category: "utility",
  async execute(bot, message) {
    const embed1 = new MessageEmbed()
      .setColor(message.guild.me.displayColor || "#00FFFF")
      .setDescription("Pinning...");

    const firstMsg = await message.channel.send({ embeds: [embed1] })

    const embed2 = new MessageEmbed()
      .setTitle("🏓 Pong")
      .setColor(message.guild.me.displayColor || "#00FFFF")
      .setDescription(`💓: ${Math.round(bot.ws.ping)} ms
⏱️: ${Date.now() - message.createdTimestamp} ms`);

    firstMsg.edit({ embeds: [embed2] });
  }
};
