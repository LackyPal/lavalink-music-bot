const { codeBlock } = require("@discordjs/builders");
const { inspect } = require("util");

module.exports = {
  name: "eval",
  description: "Execute a piece of javascript code",
  category: "botowner",
  ownerOnly: true,
  usage: "<code>",
  async execute(bot, message, args) {
    if (!args.length)
      return bot.say.wrongMessage(message, "You forgot to provide the code to eval.");

    const toEval = args.join(" ");

    if (toEval.toLowerCase().includes("token"))
      return bot.say.errorMessage(message, "That operation was cancelled because it may include bot token");

    try {
      let evaled = await eval(toEval);

      evaled = inspect(evaled, {
        depth: 0,
        maxArrayLength: null
      });

      const embed = bot.say.baseEmbed(message)
        .setTitle("Eval Output")
        .setDescription(`${codeBlock("js", evaled)}`);

      return message.reply({ embeds: [embed] });
    } catch (err) {
      const error = err instanceof Error ? err.message : err;

      const wrEmbed = bot.say.baseEmbed("RED")
        .setTitle("Something went wrong")
        .setDescription(codeBlock(clean(error)));

      return message.reply({ embeds: [wrEmbed] });
    }
  }
};

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}