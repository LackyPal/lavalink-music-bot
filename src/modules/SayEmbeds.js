const { MessageEmbed, Message } = require("discord.js");

/**
 * Returns a custom embed
 * @param {Message} message
 */
function BaseEmbed(message) {
  if (!message) {
    throw Error("'message' must be passed down as param! (BaseEmbed)");
  }

  const avatar = message.author?.displayAvatarURL({ dynamic: true });
  return new MessageEmbed()
    .setFooter(message.author?.tag, avatar)
    .setColor(message.guild.me.displayColor || "#00FFFF")
    .setTimestamp();
}

/**
 * Returns a custom embed
 * @param {Message} message
 */
function RootEmbed(message) {
  if (!message) {
    throw Error("'message' must be passed down as param! (BaseEmbed)");
  }

  return new MessageEmbed()
    .setColor(message.guild.me.displayColor || "#00FFFF");
}


/**
 * Returns a custom embed
 * @param {Message} message
 * @param {string} text
 */
function InfoMessage(message, text, footer) {
  if (!message) {
    throw Error("'message' must be passed down as param! (InfoMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (InfoMessage)");
  }

  const embedI = new MessageEmbed()
    .setDescription(text)
    .setColor(message.guild.me.displayColor || "#00FFFF");

  if (footer) embedI.setFooter(footer);

  if (!message.deleted) {
    return message.reply({ embeds: [embedI], allowedMentions: { repliedUser: false } }).catch(console.error);
  } else {
    return message.channel.send({ embeds: [embedI] }).catch(console.error);
  }
}

/**
 * Returns a custom embed
 * @param {Message} message
 * @param {string} text
 */
function WarnMessage(message, text) {
  if (!message) {
    throw Error("'message' must be passed down as param! (WarnMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (WarnMessage)");
  }

  const embedW = new MessageEmbed()
    .setDescription(text)
    .setColor("ORANGE");

  if (!message.deleted) {
    return message.reply({ embeds: [embedW], allowedMentions: { repliedUser: false } }).catch(console.error);
  } else {
    return message.channel.send({ embeds: [embedW] }).catch(console.error);
  }
}

/**
 * Returns a custom embed
 * @param {Message} message
 * @param {string} text
 */
function ErrorMessage(message, text) {
  if (!message) {
    throw Error("'message' must be passed down as param! (ErrorMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (ErrorMessage)");
  }

  const embedE = new MessageEmbed()
    .setDescription(text)
    .setColor("RED");

  if (!message.deleted) {
    return message.reply({ embeds: [embedE], allowedMentions: { repliedUser: false } }).catch(console.error);
  } else {
    return message.channel.send({ embeds: [embedE] }).catch(console.error);
  }
}

/**
 * Send a custom embed to player textChannel
 * @param {import("discord.js").Client} bot
 * @param {object} player
 * @param {string} text
 * @param {string} del
 */
function QueueMessage(bot, player, text, color) {
  if (!bot) {
    throw Error("'bot' must be passed down as param! (QueueMessage)");
  }

  if (!player) {
    throw Error("'player' must be passed down as param! (QueueMessage)");
  }

  if (!text) {
    throw Error("'text' must be passed down as param! (QueueMessage)");
  }

  const channel = bot.channels.cache.get(player.textChannel);
  const guild = bot.guilds.cache.get(player.guild);

  let colour = guild.me.displayColor || "#00FFFF";
  if (color) colour = color;

  const embedQ = new MessageEmbed()
    .setDescription(text)
    .setColor(colour);

  return channel.send({ embeds: [embedQ] });
}

module.exports = {
  BaseEmbed,
  RootEmbed,
  InfoMessage,
  WarnMessage,
  ErrorMessage,
  QueueMessage
};
