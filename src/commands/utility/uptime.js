const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "uptime",
  aliases: ["up", "time"],
  description: "Returns the uptime of the bot",
  category: "utility",
  execute(bot, message) {
    const uptime = moment
      .duration(bot.uptime)
      .format(" D [Days], H [Hours], m [Minutes], s [Seconds]");

    const embed = new MessageEmbed()
      .setAuthor("Uptime", bot.user.displayAvatarURL())
      .setDescription(`${uptime}`)
      .setColor(message.guild.me.displayColor || "#00FFFF");

    return message.channel.send({ embeds: [embed] });
  }
};
