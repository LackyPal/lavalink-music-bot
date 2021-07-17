module.exports = {
  name: "nodeError",
  execute(bot, node, error) {
    bot.util.sendErrorLog(bot, { stack: `${error.message}`, name: "NODE_ERROR", code: `Node "${node.options.identifier}" encountered an error` }, "error");
  }
};