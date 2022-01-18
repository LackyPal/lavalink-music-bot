module.exports = {
  name: "ping",
  aliases: ["latency"],
  description: "show the bot response speed",
  cooldown: "4",
  category: "utility",
  async execute(bot, message) {
    const embed1 = bot.say.baseEmbed(message)
      .setDescription("Pinning...");

    const firstMsg = await message.reply({ embeds: [embed1] })

    const embed2 = bot.say.baseEmbed(message)
      .setTitle("🏓 Pong")
      .setDescription(`💓: ${Math.round(bot.ws.ping)} ms
⏱️: ${Date.now() - message.createdTimestamp} ms`);

    firstMsg.edit({ embeds: [embed2] });
  }
};