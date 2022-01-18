module.exports = {
  name: "ready",
  once: true,
  execute(bot) {
    //lavalink initialisation
    bot.manager.init(bot.user.id);

    //initialising commands
    require("../../handlers/CommandHandler")(bot);

    const serverCount = bot.utils.formatNumber(bot.guilds.cache.size);
    const userCount = bot.utils.formatNumber(
      bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    );
    const channelCount = bot.utils.formatNumber(bot.channels.cache.size);

    const statuses = [
      { "name": `${serverCount} servers & ${userCount} users`, "type": "WATCHING" },
      { "name": "with L0SER#8228", "type": "STREAMING" },
      { "name": `${bot.config.bot.config.PREFIX}play | ${bot.config.PREFIX}help`, "type": "LISTENING" }
    ];

    const data = `${bot.user.tag} is running with ${serverCount} servers, ${channelCount} channels and ${userCount} users`;

    bot.logger.info("BOT_READY", data);

    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      bot.user.setActivity(status.name, { type: status.type });
    }, 60000);
  }
};