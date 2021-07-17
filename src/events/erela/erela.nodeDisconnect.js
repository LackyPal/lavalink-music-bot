module.exports = {
  name: "nodeDisconnect",
  execute(bot, node, reason) {
    bot.util.sendErrorLog(bot, { stack: `Code- ${reason.code}.\nReason- ${reason.reason}`, name: "NODE_DISCONNECTED", code: `Node "${node.options.identifier}" has been disconnected.` }, "error");
  }
};