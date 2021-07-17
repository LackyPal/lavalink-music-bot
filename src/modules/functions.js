const moment = require("moment");
const DJS = require("discord.js");
const { Util } = require("discord.js");
const { codeBlock } = require("@discordjs/builders");
const fs = require("fs");

/**
 * @param {import("discord.js").Client} bot
 * @param {"warning" | "error"} type
 */
async function sendErrorLog(bot, error, type) {
  try {
    /* eslint-disable-next-line */
    if (error.stack?.includes?.('type: Value "voice" is not int.')) return;
    if (error.stack?.includes?.("DeprecationWarning: Listening to events on the Db class")) return;

    if (!bot.env.logsChannelId) {
      return bot.logger.error("ERR_LOG", error?.stack || `${error}`);
    }

    const channel =
      bot.channels.cache.get(bot.env.logsChannelId) || (await bot.channels.fetch(bot.env.logsChannelId));

    if (!channel || !channel.permissionsFor(bot.user)?.has(DJS.Permissions.FLAGS.SEND_MESSAGES) || !channel.permissionsFor(bot.user)?.has(DJS.Permissions.FLAGS.EMBED_LINKS)) {
      return bot.logger.error("ERR_LOG", error?.stack || `${error}`);
    }

    const code = error.code || "N/A";
    const httpStatus = error.httpStatus || "N/A";
    const requestData = error.requestData ?? { json: {} };
    const name = error.name || "N/A";
    let stack = error.stack || error;
    let jsonString;

    try {
      jsonString = JSON.stringify(requestData.json, null, 2);
    } catch {
      jsonString = "";
    }

    if (jsonString?.length >= 4096) {
      jsonString = jsonString ? `${jsonString?.substr(0, 4090)}...` : "";
    }

    if (typeof stack === "object") stack = JSON.stringify(stack);

    if (typeof stack === "string" && stack.length >= 4096) {
      console.error(stack);
      stack = "An error occurred but was too long to send to Discord, check your console.";
    }

    const embed = new DJS.MessageEmbed()
      .setTitle("An error occurred")
      .addField("Name", name, true)
      .addField("Code", code.toString(), true)
      .addField("httpStatus", httpStatus.toString(), true)
      .addField("Timestamp", bot.logger.now, true)
      .addField("Request data", codeBlock(jsonString?.substr(0, 1020)))
      .setDescription(`${codeBlock(stack)}`)
      .setColor(type === "error" ? "RED" : "ORANGE");

    await channel.send({ embeds: [embed] });
  } catch (e) {
    console.error({ error });
    console.error(e);
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
  if ((str === null) || (str === "")) {
    return false;
  } else {
    str = str.toString();
  }

  return str.replace(/\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
}

function formatNumber(n) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/**
 * @param {string} time
 * @returns {number}
 */
function toTimeMilliSeconds(time) {
  if (isNaN(time) && !time.includes(":")) return false;

  const t = time.split(":");
  let seconds;
  if (t.length === 3) seconds = (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
  else if (t.length === 2) seconds = (+t[0]) * 60 + (+t[1]);
  else if (t.length === 1) seconds = t[0];

  return Number(seconds * 1000);
}

/**
 * @param {string} string
 * @returns {string}
 */
function codeContent(string, extension = "") {
  return `\`\`\`${extension}\n${string}\`\`\``;
}

module.exports = {
  sendErrorLog,
  toTitleCase,
  formatNumber,
  toTimeMilliSeconds,
  codeContent
};