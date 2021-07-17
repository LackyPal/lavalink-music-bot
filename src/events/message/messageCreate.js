const DJS = require("discord.js");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {import("discord.js").Client} bot
   * @param {import("discord.js").Message} message
   */
  async execute(bot, message) {
    try {
      if (!message?.guild?.available || !message.guild) return;
      if (message.channel.type === "DM") return;
      if (!bot.user) return;
      if (!message.guild?.me) return;

      if (!message.channel.permissionsFor(message.guild.me)?.has(DJS.Permissions.FLAGS.SEND_MESSAGES)) return;

      const guildId = message?.guild?.id;
      const userId = message?.author?.id;
      const channel = message?.channel;
      const cooldowns = bot.cooldowns;
      
      const serverPrefix = bot.env.ptefix ?? "!";

      const escapeRegex = (str) => str?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const prefix = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(serverPrefix)}\\s*`);

      // Commands
      if (!prefix.test(message.content) || message.author.bot || userId === bot.user.id) return;

      const [, matchedPrefix] = message.content.match(prefix);
      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      if (message.mentions.has(bot.user.id) && !command) {
        bot.say.InfoMessage(message, `My prefix is **\`${serverPrefix}\`**`);
      }

      const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
      if (!bot.commands.has(cmd?.name)) return;

      if (!channel.permissionsFor(message.guild.me)?.has(DJS.Permissions.FLAGS.EMBED_LINKS) && bot.user.id !== userId) {
        return channel.send({ content: `Error: I need \`EMBED_LINKS\` permission to work.` });
      }

      const now = Date.now();
      const timestamps = cooldowns.get(cmd.name);
      const cooldownAmount = cmd.cooldown * 1000;

      if (cmd.ownerOnly && !bot.env.owners.includes(userId)) {
        return bot.say.ErrorMessage(message, "This command can only be used by the bot owners.");
      }

      // botPermissions
      if (cmd.botPermissions) {
        const neededPerms = [];
        cmd.botPermissions.forEach((perm) => {
          if (!(channel).permissionsFor(message.guild.me)?.has(`DJS.Permissions.FLAGS.${perm}`)) {
            neededPerms.push(perm);
          }
        });

        if (neededPerms.length > 0) {
          return bot.say.ErrorMessage(message,
            `I need ${neededPermissions
              .map((p) => `\`${bot.util.toTitleCase(p)}\``)
              .join(", ")} permissions!`
          );
        }
      }

      // memberPermissions
      if (cmd.memberPermissions) {
        const neededPerms = [];
        cmd.memberPermissions.forEach((perm) => {
          if (!(message.channel).permissionsFor(message.member)?.has(`DJS.Permissions.FLAGS.${perm}`)) {
            neededPerms.push(perm);
          }
        });

        if (neededPerms.length > 0) {
          return bot.say.ErrorMessage(message,
            `You need: ${neededPermissions
              .map((p) => `\`${bot.util.toTitleCase(p)}\``)
              .join(", ")} permissions!`
          );
        }
      }

      if (timestamps.has(userId)) {
        const userTime = timestamps.get(userId);
        const expTime = userTime + cooldownAmount;

        if (now < expTime) {
          const timeLeft = (expTime - now) / 1000;
          const embed4 = `\`${cmd.name}\` command is on cooldown for another \`${timeLeft.toFixed(1)}\`.`;
          return bot.say.WarnMessage(message, embed4);
        }
      }

      timestamps.set(userId, now);
      setTimeout(() => timestamps.delete(userId), cooldownAmount);

      cmd.execute(bot, message, args);
    } catch (err) {
      bot.say.ErrorMessage(message, "Something went wrong. Sorry for the inconveniences.");
      return bot.util.sendErrorLog(bot, err, "error");
    }
  }
};
