require("./modules/checkValid");

const { Collection, Client, Intents } = require("discord.js");

const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");

const config = require("../config.json");
const Logger = require("./modules/Logger");
const Embeds = require("./modules/SayEmbeds");
const Util = require("./modules/functions");

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  partials: ["GUILD_MEMBER", "MESSAGE", "USER", "CHANNEL"],
  allowedMentions: { repliedUser: true }
});

bot.commands = new Collection();
bot.aliases = new Collection();
bot.cooldowns = new Collection();

bot.config = config;
bot.logger = Logger;
bot.utils = Util;
bot.say = Embeds;

bot.manager = new Manager({
  nodes: [
    {
      "host": "lava.link",
      "port": 80,
      "password": "youshallnotpass",
      "retryDelay": 5000
    }
  ],
  plugins: [
      new Spotify({
      clientID: config.spotifyClientId,
      clientSecret: config.spotifyClientSecret
    }),
      new Deezer(),
      new Facebook()
    ],
  autoPlay: true,
  send: (id, payload) => {
    const guild = bot.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

require("./handlers/EventHandler")(bot);

bot.login(config.DISCORD_BOT_TOKEN);

//bot.setMaxListeners(0)

// Unhandled errors
process.on("unhandledRejection", (error) => {
  Util.sendErrorLog(bot, error, "error")
});

process.on("uncaughtExceptionMonitor", (error) => {
  Util.sendErrorLog(bot, error, "error")
});

process.on("warning", (warning) => {
  if (warning.stack.startsWith("(node:13988) [DEP0148]")) return;

  Util.sendErrorLog(bot, warning, "warning");
});