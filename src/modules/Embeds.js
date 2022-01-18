const DJS = require("discord.js");


/**
 * Returns a custom embed
 * @param {(DJS.Message|DJS.Guild|string|number)} [resolvable]
 */
function baseEmbed(resolvable = "BLUE", ) {
  let colour;
  if (typeof resolvable === "object")
    colour = ("guild" in resolvable ? resolvable.guild : resolvable)?.me.displayColor || "#BLUE";
  else colour = resolvable;

  return new DJS.MessageEmbed()
    .setColor(colour);
}

/**
 * Reply a custom embed to message
 * @param {DJS.Message} message
 * @param {string} text
 * @param {string} [footerText] - footer text
 */
function successMessage(message, text, footerText) {
  if (!message) {
    throw Error("'message' must be passed down as param! (successMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (successMessage)");
  }

  let embedS = new DJS.MessageEmbed()
    .setDescription(text)
    .setColor(message.guild.me.displayColor || "BLUE");

  if (footerText) embedS.setFooter({ text: `${footerText}` });

  return message.reply({ embeds: [embedS] }).catch(console.error);
}

/**
 * Reply a custom embed to message
 * @param {DJS.Message} message
 * @param {string} text
 */
function wrongMessage(message, text) {
  if (!message) {
    throw Error("'message' must be passed down as param! (wrongMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (wrongMessage)");
  }

  const embedW = new DJS.MessageEmbed()
    .setDescription(text)
    .setColor("RED");

  return message.reply({ embeds: [embedW] }).catch(console.error);
}

/**
 * Send a custom embed to player textChannel
 * @param {DJS.Client} bot
 * @param {object} player
 * @param {string} text
 * @param {string} [color]
 */
function queueMessage(bot, player, text, color) {
  if (!bot) {
    throw Error("'bot' must be passed down as param! (queueMessage)");
  }

  if (!player) {
    throw Error("'player' must be passed down as param! (queueMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (queueMessage)");
  }

  const channel = bot.channels.cache.get(player.textChannel);

  if (!channel) return;

  let colour = channel.guild.me.displayColor || "BLUE";
  if (color) colour = color;

  const embedQ = new DJS.MessageEmbed()
    .setDescription(text)
    .setColor(colour);

  return channel.send({ embeds: [embedQ] });
}

module.exports = {
  baseEmbed,
  successMessage,
  wrongMessage,
  queueMessage
};