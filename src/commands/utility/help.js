const catDetails = require("../../data/categoryDetails.json");
const categories = require("../../data/categories.json");

module.exports = {
  name: "help",
  description: "Shows the help menu",
  category: "utility",
  cooldown: 4,
  aliases: ["h"],
  async execute(bot, message, args) {
    const prefix = bot.env.prefix ?? "X";
    const cmdArgs = args[0]?.toLowerCase();

    if (cmdArgs) {
      const cmd =
        bot.commands.get(cmdArgs) || bot.commands.get(bot.aliases.get(cmdArgs));
      if (!cmd) return bot.say.WarnMessage(message, "Command or alias not found");

      const aliases = cmd.aliases ? cmd.aliases.map((alias) => alias) : "None";
      const cmdUsage = cmd.usage ? `${prefix}${cmd.name} ${cmd.usage}` : `${prefix}${cmd.name}`;

      const embed = bot.say.BaseEmbed(message)
        .setAuthor(`${cmd.category} command: ${cmd.name}`, bot.user.displayAvatarURL())
        .addField(`${cmdUsage}`, `${cmd.description ?? "Not specified"}`);

      if (cmd.aliases) embed.setDescription(`**Aliases:** \`\`\`${aliases}\`\`\``);

      const subcmd = cmd.subCommands;
      if (subcmd && subcmd.length >= 1) {
        for (let s = 0; s < subcmd.length; s++) {
          embed.addField("** **", `**${prefix}${cmd.name} ${subcmd[s]}`);
        }
      }

      return message.channel.send({ embeds: [embed] });
    }

    const cates = [];
    for (let i = 0; i < categories.length; i++) {
      const category = bot.commands
        .filter(({ category }) => category === categories[i])
        .map(({ name }) => name);
      cates.push(category);
    }

    const embed = bot.say.RootEmbed(message);
    for (let j = 0; j < cates.length; j++) {
      const name = catDetails[categories[j]];
      if (categories[j] === "botowner" && !bot.env.owners.includes(message.author.id)) continue;
      embed.addField(`${name}`, `\`\`\`${cates[j].join(", ")}\`\`\``);
    }

    embed
      .setFooter(`Type '${prefix}help <CommandName>' for details on a command`)
      .setAuthor("Help Commands", bot.user.displayAvatarURL());

    return message.channel.send({ embeds: [embed] });
  }
};
