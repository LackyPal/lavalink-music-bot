module.exports = {
  name: "voiceStateUpdate",
  execute(bot, oldState, newState) {
    const player = bot.manager.get(oldState.guild.id);
    if (!player) return;

    const voiceChannel = bot.channels.cache.get(player.voiceChannel);

    if (oldState && oldState.channel && !voiceChannel.members.filter(m => !m.user.bot).size && player.voiceChannel === oldState.channelId) {
      setTimeout(() => {
        bot.say.queueMessage(bot, player, "I left the voice channel as I was left alone.");

        return player.destroy();
      }, 60000);
    }
  }
};