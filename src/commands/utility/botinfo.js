const { version } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "botinfo",
  aliases: ["botstats", "info", "stats"],
  description: "Shows info about the bot",
  category: "utility",
  async execute(bot, message) {
    const uptime = moment.duration(bot.uptime).format(" D [Days], H [Hours], m [Minutes], s [Seconds]");
    const nodev = process.version;
    const createdAt = new Date(bot.user.createdAt);
    let users = 0;
    bot.guilds.cache.forEach(x => {
      users += x.memberCount;
    });

    const embed = bot.say.BaseEmbed(message)
      .setAuthor(`${bot.user.username}’s Information`, bot.user.displayAvatarURL())
      .addField("__**General Info**__",
        `**Bot Id:** ${bot.user.id}
**Bot Tag:** ${bot.user.tag}
**Created At :** ${createdAt.toDateString()}
**Developer: [L0SER#8228](https://l0ser.is-a.dev)**
**Global Prefix:** ${bot.user} (@${bot.user.tag})`
      )
      .addField("__**Bot Stats:**__",
        `**Users:** ${bot.util.formatNumber(users)}
**Servers:** ${bot.util.formatNumber(bot.guilds.cache.size)}
**Channels:** ${bot.util.formatNumber(bot.channels.cache.size)}
**Command Count:** ${bot.util.formatNumber(bot.commands.size)}`
      )
      .addField("__**System Info**__",
        `**RAM Usage:**  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**Bot Uptime:** ${uptime}
**Node Version:** ${nodev}
**Discord.js Version:** ${version}
**Platform:** ${bot.util.toTitleCase(process.platform)}`
      );

    return message.channel.send({ embeds: [embed] });
  }
}
