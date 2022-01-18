const glob = require("glob");
const { Collection } = require("discord.js");

module.exports = async function loadCommands(bot) {
  const commandFiles = glob.sync("./src/commands/**/*.js");

  for (const file of commandFiles) {
    const command = require(`../../${file}`);

    if (!command.name) {
      throw new TypeError(`[ERROR][COMMANDS]: name is required for commands! (${file})`);
    }

    if (!command.execute) {
      throw new TypeError(`[ERROR][COMMANDS]: execute function is required for commands! (${file})`);
    }

    if (!command.category) {
      bot.logger.warn("[WARNING]", `Command: ${command.name} will not be shown in the help command because no category is set.`);
    }

    delete require.cache[require.resolve(`../../${file}`)];

    bot.commands.set(command.name, command);

    if (command.aliases) {
      for (const alias of command.aliases) {
        bot.aliases.set(alias, command.name);
      }
    }

    const cooldowns = bot.cooldowns;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    // debug
    bot.logger.debug("COMMANDS", `Loaded ${command.category}: ${command.name}`);
  }
};