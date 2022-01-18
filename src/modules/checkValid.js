const config = require("../../config.json");
const logger = require("../utils/logger");

function checkValid() {
  const nodeV = parseFloat(process.versions.node);
  const npmV = parseFloat(process.versions.node);

  if (nodeV < 16) {
    throw Error("[ERROR]: This bot requires version 16.6 of nodejs! Please upgrade to version 16.6 or more.");
  }

  if (npmV < 7) {
    throw Error("[ERROR]: Please upgrade npm to version 7 or more.");
  }

  if (!config.DISCORD_BOT_TOKEN || config.DISCORD_BOT_TOKEN === "") {
    throw Error("[ERROR][BOT]: DISCORD_BOT_TOKEN is must required");
  }

  if (!config.SPOTIFY_CLIENT_ID || config.SPOTIFY_CLIENT_ID === "") {
    logger.error("CONFIG", "SPOTIFY_CLIENT_ID is must required");
  }

  if (!config.SPOTIFY_CLIENT_SECRET || config.SPOTIFY_CLIENT_SECRET === "") {
    logger.error("CONFIG", "SPOTIFY_CLIENT_SECRET is must required");
  }

  if (!config.BOT_INVITE_LINK || config.BOT_INVITE_LINK === "") {
    logger.warn("CONFIG", "BOT_INVITE_LINK is required to invite the bot");
  }

  if (!config.SUPPORT_SERVER_LINK || config.SUPPORT_SERVER_LINK === "") {
    logger.warn("CONFIG", "SUPPORT_SERVER_LINK link is required for discord support");
  }

  if (!config.BOT_OWNER_IDS[0]) {
    logger.error("CONFIG", "BOT_OWNER_IDS is required for bot-owner only commands");
  }


  if (!config.LOGS_CHANNEL_ID || config.LOGS_CHANNEL_ID === "") {
    logger.error(
      "CONFIG",
      "LOGS_CHANNEL_ID is required for reporting any errors (if none is provided, the bot will only log errors in the console)"
    );
  }
}

checkValid();