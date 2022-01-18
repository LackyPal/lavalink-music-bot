module.exports = {
  name: "uptime",
  aliases: ["up", "time"],
  description: "Returns the uptime of the bot",
  category: "utility",
  execute(bot, message) {
    const uptime = bot.utils.formatDuration(bot.uptime);

    const embed = bot.say.baseEmbed(message)
    bot.say.baseEmbed(message)
      .setAuthor({
        name: "Uptime",
        iconURL: bot.user.displayAvatarURL()
      })
      .setDescription(`${uptime}`);

    return message.reply({ embeds: [embed] });
  }
};