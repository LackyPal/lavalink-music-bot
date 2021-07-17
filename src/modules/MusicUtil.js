// eslint-disable-next-line no-unused-vars
const { MessageEmbed, Message } = require("discord.js");

/**
 * Check if modify queue
 * @param {Message} message
 */
function canModifyQueue(message) {
  const userChannelId = message.member.voice.channelId;
  const botChannelId = message.guild.me.voice.channelId;

  if (userChannelId !== botChannelId) {

    const embed = new MessageEmbed()
      .setDescription("You need to be in the same voice channel as me!")
      .setColor("ORANGE");

    if (!message.deleted) {
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
    } else {
      message.channel.send({ embeds: [embed] }).catch(console.error);
    }
    return;
  }
  return true;
}

module.exports = { canModifyQueue };
