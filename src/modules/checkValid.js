const config = require("../../config.json");
const Logger = require("../modules/Logger");

function checkValid() {
  const v = parseFloat(process.versions.node);

  if (v < 14) {
    throw Error("[ERROR]: This bot requires version 14 of nodejs! Please upgrade to version 14");
  }

  if (!config.discordBotToken || config.discordBotToken === "") {
    throw Error("[ERROR][BOT]: discordBotToken is required");
  }

  if (!config.spotifyClientId || config.spotifyClientId === "") {
    throw Error("[ERROR][BOT]: spotifyClientId is required to play Spotify URLs");
  }

  if (!config.spotifyClientSecret || config.spotifyClientSecret === "") {
    throw Error("[ERROR][BOT]: spotifyClientSecret is required to play Spotify URLs");
  }

  if (!config.geniusApiKey || config.geniusApiKey === "") {
    throw Error("[ERROR][BOT]: geniusApiKey is required for lyrics command.");
  }

  if (!config.owners[0]) {
    Logger.warn("bot", "ownerId is required for bot-owner commands");
  }

  if (!config.logsChannelId || config.logsChannelId === "") {
    Logger.warn("bot", "logsChannelId is required for reporting any errors (if none is provided, the bot will only log errors in the console)");
  }
}

module.exports = checkValid;