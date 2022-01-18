module.exports = {
  name: "nodeConnect",
  execute(bot, node) {
    bot.logger.info("NODE_CONNECT", `${node.options.identifier} is connected.`);
  }
};