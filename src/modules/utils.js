const DJS = require("discord.js");
const { codeBlock } = require("@discordjs/builders");


/**
 * Logs error through discord channel
 * @param {DJS.Client} bot
 * @param {DJS.DiscordAPIError|DJS.HTTPError|Error } error
 * @param {"warning" | "error"} type
 */
async function sendErrorLog(bot, error, type) {
  try {
    if (error.message?.includes("Missing Access")) return;
    if (error.message?.includes("Unknown Message")) return;
    if (error.message?.includes("Unknown interaction")) return;

    if (
      error.stack?.includes("TypeError: Cannot read properties of undefined (reading 'messages')")
    ) {
      return logger.error("ERR_LOG", error);
    }

    const { LOGS_CHANNEL_ID } = require("../../config.json");
    if (!LOGS_CHANNEL_ID) {
      return logger.error("ERR_LOG", error.stack || `${error}`);
    }

    const channel = bot.channels.cache.get(LOGS_CHANNEL_ID) ||
      (await bot.channels.fetch(LOGS_CHANNEL_ID));

    if (!channel) {
      return logger.error("ERR_LOG", error?.stack || `${error}`);
    }

    const code = "code" in error ? error.code : "N/A";
    const httpStatus = "httpStatus" in error ? error.httpStatus : "N/A";
    const requestData = "requestData" in error ? error.requestData : { json: {} };

    const name = error.name || "N/A";
    let stack = error.stack || error;
    let jsonString = "";

    try {
      jsonString = JSON.stringify(requestData.json, null, 2);
    } catch {
      jsonString = "";
    }

    if (jsonString?.length > 1024) {
      jsonString = jsonString ? `${jsonString.substr(0, 1020)}...` : "";
    }

    if (typeof stack === "string" && stack.length > 4096) {
      console.error(stack);
      stack = "An error occurred but was too long to send to Discord, check your console.";
    }

    const embed = new DJS.MessageEmbed()
      .setTitle("An error occurred")
      .addField("Name", name, true)
      .addField("Code", code.toString(), true)
      .addField("httpStatus", httpStatus.toString(), true)
      .addField("Timestamp", bot.logger.now, true)
      .addField("Request data", codeBlock(jsonString))
      .setDescription(codeBlock(`${stack}`))
      .setColor(type === "error" ? "RED" : "ORANGE")
      .setFooter({
        text: bot.user.tag,
        iconURL: bot.user.displayAvatarURL()
      })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  } catch (e) {
    console.error({ error });
    console.error(e);
  }
}

/**
 * escape from discord markdown
 * @param {string} content
 * @returns {string}
 */
function escapeMarkdown(content) {
  if (!content) return null;
  return DJS.Util.escapeMarkdown(content, {
    codeBlock: true,
    spoiler: true,
    inlineCode: true,
    inlineCodeContent: true,
    codeBlockContent: true
  });
}

/**
 * Get the comnand from name or alias
 * @param {string} nameOrAlias
 */
function resolveCommand(bot, nameOrAlias) {
  const strgCmd = nameOrAlias.toLowerCase();

  return (
    bot.commands.get(strgCmd) ??
    bot.commands.get(bot.aliases.get(strgCmd))
  );
}

/**
 * Text to Title Case
 * @param {string} text
 * @returns {string}
 */
function toTitleCase(text) {
  if (!text) return null;

  return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Format number to local string
 * @param {number | string} n
 * @returns {string}
 */
function formatNumber(n) {
  return Number.parseFloat(String(n)).toLocaleString("en-IN");
}

/**
 * Format the integer
 * @param {number} int
 * @returns {string}
 */
function formatInt(int) {
  return (int < 10 ? `0${int}` : int);
}

/**
 * Format milliseconds duration to string
 * @param {number} input - milliseconds duration
 * @returns {string}
 */
function formatDuration(input) {
  if (!input || !parseInt(input)) return "00:00";

  const seconds = Math.floor(input % 60000 / 1000);
  const minutes = Math.floor(input % 3600000 / 60000);
  const hours = Math.floor(input / 3600000);

  if (hours > 0) {
    return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  }

  if (minutes > 0) {
    return `${formatInt(minutes)}:${formatInt(seconds)}`;
  }

  return `00:${formatInt(seconds)}`;
};

/**
 * Convert formatted duration to milliseconds
 * @param {string} formatted duration input
 * @returns {number}
 */
function toTimeMS(input) {
  if (!input) return 0;
  if (typeof input !== "string") return Number(input) || 0;

  if (input.match(/:/g)) {
    const time = input.split(":").reverse();
    let s = 0;
    for (let i = 0; i < 3; i++)
      if (time[i]) s += Number(time[i].replace(/[^\d.]+/g, "")) * Math.pow(60, i);
    if (time.length > 3) s += Number(time[3].replace(/[^\d.]+/g, "")) * 24 * 60 * 60;
    return Number(s) || 0;
  } else {
    return Number(input);
  }
}

/**
 * Check if member can modify queue
 * @param {DJS.message} message
 * @returns {boolean}
 */
function modifyQueue(message) {
  const memberChannelId = message.member?.voice?.channelId;
  const botChannelId = message.guild.me?.voice?.channelId;

  if (!memberChannelId) {
    return message.client.say.wrongMessage(message, "You need to join a voice channel first!");
  }

  if (memberChannelId !== botChannelId) {
    return message.client.say.wrongMessage(message, "You must be in the same voice channel as me!");
  }

  return true;
}

module.exports = {
  sendErrorLog,
  escapeMarkdown,
  resolveCommand,
  toTitleCase,
  formatNumber,
  formatDuration,
  toTimeMS,
  modifyQueue
};