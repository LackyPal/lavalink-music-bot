const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../../config.json");

module.exports = {
  name: "messageCreate",
  async execute(bot, message) {
    try {
      if (!message) return;
      if (!message.guild?.available || !message.guild) return;
      if (message.channel.type === "DM") return;
      if (!bot.user) return;
      if (!message.guild.me) return;
      if (!message.channel.permissionsFor(message.guild.me)?.has(2048n)) return;

      const guildId = message.guild.id;
      const userId = message.author?.id;

      const serverPrefix = config.PREFIX ?? ">";

      const escapeRegex = (str) => str?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const prefixReg = new RegExp(`^(<@!?${bot?.user?.id}>|${escapeRegex(serverPrefix)})\\s*`);

      const prefixArr = message.content.match(prefixReg);
      const prefix = prefixArr?.[0];

      if (!prefix) return; // prefix didn't match
      if (!prefixReg.test(message.content) || message.author.bot || userId === bot.user.id) return;
      const [arg, ...args] = message.content.slice(prefix?.length).trim().split(/ +/g);
      const cmd = arg.toLowerCase();

      if (
        !message.channel.permissionsFor(message.guild.me)?.has(16384n) &&
        bot.user.id !== userId
      ) {
        return message.reply({
          content: `Error: I need \`Embed Links\` permission to work!`
        });
      }

      // bot mention
      if (message.mentions.members?.has(bot.user.id) && !cmd) {
        const embed = new MessageEmbed()
          .setAuthor({
            name: bot.user.tag,
            iconURL: bot.user.displayAvatarURL()
          })
          .setDescription(`My prefix is **${serverPrefix}**
Type \`${serverPrefix}help\` for all available commands.`);

        const supportBtn = new MessageButton()
          .setLabel("Support")
          .setStyle("LINK")
          .setURL(`${config.SUPPORT_SERVER_LINK}`);

        const inviteBtn = new MessageButton()
          .setLabel("Invite")
          .setStyle("LINK")
          .setURL(`${config.BOT_INVITE_LINK}`);

        const buttonsRow = new MessageActionRow().addComponents([supportBtn, inviteBtn]);

        return message.reply({ embeds: [embed], components: [buttonsRow] });
      }

      const command = bot.utils.resolveCommand(bot, cmd);
      if (!command) return;
      
if ((command.category === "botowner" || command.ownerOnly === true) && !config.BOT_OWNER_IDS.includes(userId))
        return bot.say.wrongMessage(message, "This command can only be used by the bot owners.");

      const timestamps = bot.cooldowns.get(command.name);
      const now = Date.now();
      const cooldown = command.cooldown ? command.cooldown * 1000 : 3000;

      if (timestamps?.has(userId)) {
        const userTime = timestamps.get(userId);
        const expireTime = userTime + cooldown;

        if (now < expireTime) {
          const timeLeft = (expireTime - now) / 1000;

          return bot.say.wrongMessage(message, `Please wait **${timeLeft.toFixed(1)}** second more before reusing the \`${command.name}\` comnand.`);
        }
      }

      timestamps?.set(userId, now);
      setTimeout(() => timestamps?.delete(userId), cooldown);

      await command.execute(bot, message, args);
    } catch (err) {
      bot.utils.sendErrorLog(bot, err, "error");
      return bot.say.wrongMessage(message, "Something went wrong.");
    }
  }
};