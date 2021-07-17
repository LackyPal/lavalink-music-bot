module.exports = {
  name: "voiceStateUpdate",
  async execute(bot, oldState, newState) {
    const player = await bot.manager.get(oldState.guild.id);
    if (!player) return;

    const voiceChannel = bot.channels.cache.get(player.voiceChannel);

    if (oldState && oldState.channel && !voiceChannel.members.filter(m => !m.user.bot).size && player.voiceChannel === oldState.channelId) {
      setTimeout(async () => {
         bot.say.QueueMessage(bot, player, "I left the voice channel as I was left alone.", "RED");
         return player.destroy();
      }, 60000);
    }
  }
};
