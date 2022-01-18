module.exports = async function loadCommands(bot) {
  const eventFiles = glob.sync("./src/events/**/*.js");

  for (const file of eventFiles) {
    const event = require(`../../${file}`);

    let type = "bot";
    if (file.includes("player.")) type = "player";
    if (file.includes("erela.")) type = "erela";

    if (!event.name) {
      throw new TypeError(`[ERROR]: name is required for events! (${file})`);
    }

    if (!event.execute) {
      throw new TypeError(`[ERROR]: execute function is required for events! (${file})`);
    }

    switch (type) {
      case "player":
      case "erela":
        bot.manager.on(event.name, event.execute.bind(null, bot));
        break;
      default:
        bot.on(event.name, event.execute.bind(null, bot));
    }

    delete require.cache[require.resolve(`../../${file}`)];

    // debug
    bot.logger.debug("EVENTS", `Loaded ${type}: ${event.name}`);
  }
};