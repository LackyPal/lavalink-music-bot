module.exports = {
  name: "ready",
  async execute(bot) {
    //lavalink initialisation
    bot.manager.init(bot.user.id);

    const serverCount = bot.util.formatNumber(bot.guilds.cache.size);
    const channelCount = bot.util.formatNumber(bot.channels.cache.size);
    let users = 0;
    bot.guilds.cache.forEach(x => {
      users += x.memberCount;
    });
    const userCount = bot.util.formatNumber(users);

    const statuses = [
      { "name": `${userCount} users and ${channelCount} channels`, "type": "WATCHING" },
      { "name": "with L0SER#8228", "type": "STREAMING" },
      { "name": `${bot.env.prefix}play | ${bot.env.prefix}help`, "type": "LISTENING" }
    ];

    const data = `Bot is running with ${serverCount} servers, ${channelCount} channels and ${userCount} users`;

    bot.logger.log("BOT_READY", data);

    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      bot.user.setActivity(status.name, { type: status.type });
    }, 60000);
  }
};