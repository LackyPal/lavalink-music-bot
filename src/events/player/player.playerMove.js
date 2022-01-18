 module.exports = {
   name: "playerMove",
   async execute(bot, player, oldChannel, newChannel) {
     if (!newChannel) {
       await player.destroy();

       return bot.say.queueMessage(bot, player, "Music stopped as I have been disconnected from the voice channel.", "RED");
     } else {
       player.voiceChannel = newChannel;
     }
   }
 };