"use strict";

const fp = require("fastify-plugin");
const getSocketIO = require("../common/socket-service");

module.exports = fp(async (fastify) => {
  const io = getSocketIO(fastify.server);

  fastify.decorate("io", io);
});
