const { codeBlock } = require("@discordjs/builders");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  description: "Eval",
  category: "botowner",
  ownerOnly: true,
  aliases: ["e"],
  async execute(bot, message, args) {
    if (!args.length)
      return bot.say.WarnMessage(message, "You forgot the code to eval.");

    const toEval = args.join(" ");

    try {
      let evaled = await eval(toEval);

      const eevaled = typeof evaled;
      evaled = inspect(evaled, {
        depth: 0,
        maxArrayLength: null,
      });

      const type = bot.util.toTitleCase(eevaled);

      if (eevaled === "object") evaled = JSON.stringify(evaled);

      const embed1 = bot.say.RootEmbed(message)
        .setTitle("Eval Command")
        .setDescription(`Eval Type: \`${type}\``);

      const embed2 = bot.say.RootEmbed(message)
        .setTitle("Eval Input")
        .setDescription(`${codeBlock("js", toEval)}`);

      const embed3 = bot.say.BaseEmbed(message)
        .setTitle("Eval Output")
        .setDescription(`${codeBlock("js", evaled)}`);

      return message.channel.send({ embeds: [embed1, embed2, embed3] });
    } catch (error) {
      const wrEmbed = bot.say.BaseEmbed(message)
        .setTitle("Something went wrong")
        .setDescription(`\`\`\`${clean(error)}\`\`\``);

      message.channel.send({ embeds: [wrEmbed] });
    }
  }
};

const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}