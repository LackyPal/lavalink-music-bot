module.exports = {
  name: "reload",
  description: "Reloads a command",
  category: "botowner",
  ownerOnly: true,
  execute(bot, message, args) {
    if (!args.length)
      return bot.say.WarnMessage(message, "You forgot the command name.");

    const cmd = args[0].toLowerCase();

    if (cmd === "all") {
      bot.commands.forEach((c) => {
        if (c.category === "exempt") return;
        delete require.cache[require.resolve(`../${c.category}/${c.name}.js`)];
        setCmd(bot, c);
      });
      return bot.say.InfoMessage(message, "Reloaded all commands");
    }

    const command = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));

    if (!command) {
      return bot.say.ErrorMessage(message, "Command not found");
    }

    try {
      delete require.cache[require.resolve(`../${command.category}/${command.name}.js`)];
      setCmd(bot, command);
      bot.say.InfoMessage(message, `Successfully reload command: \`${command.name}\``);
    } catch (e) {
      bot.logger.error("ReloadCommands", e?.stack || e);
      return bot.say.ErrorMessage(message, "An error occurred");
    }
  }
};

function setCmd(bot, cmd) {
  const command = require(`../${cmd.category}/${cmdName}.js`);
  bot.commands.set(command.name, command);
  if (cmd.aliases) {
    for (const alias of cmd.aliases) {
      bot.aliases.set(alias, cmd.name);
    }
  }
};
