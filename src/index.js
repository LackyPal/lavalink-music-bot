require("./modules/checkValid")();

const { Collection, Client, Intents } = require("discord.js");

const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");

const env = require("../config.json");

const Logger = require("./modules/Logger");
const { canModifyQueue } = require("./modules/MusicUtil");
const EmbedSay = require("./modules/SayEmbeds");
const Util = require("./modules/functions");

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  partials: ["GUILD_MEMBER", "MESSAGE", "USER", "CHANNEL"],
  allowedMentions: { parse: ["roles", "users"], repliedUser: true },
  restTimeOffset: 0
});

bot.commands = new Collection();
bot.aliases = new Collection();
bot.cooldowns = new Collection();

bot.env = env;
bot.logger = Logger;
bot.util = Util;
bot.canModifyQueue = canModifyQueue;
bot.say = EmbedSay;

bot.manager = new Manager({
  nodes: [{
    "host": "lava.link",
    "port": 80,
    "password": "youshallnotpass",
    "retryDelay": 5000,
       }],
  plugins: [
      new Spotify({
      clientID: env.spotifyClientId,
      clientSecret: env.spotifyClientSecret
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

require("moment-duration-format");
require("./handler/command")(bot);
require("./handler/events")(bot);

bot.login(env.discordBotToken);

//bot.setMaxListeners(0)

// Unhandled errors
process.on("unhandledRejection", (error) => Util.sendErrorLog(bot, error, "error"));

process.on("uncaughtExceptionMonitor", (error) => Util.sendErrorLog(bot, error, "error"));

process.on("warning", (warning) => {
  if (warning.stack.startsWith("(node:13988) [DEP0148]")) return;

  Util.sendErrorLog(bot, warning, "warning");
});
