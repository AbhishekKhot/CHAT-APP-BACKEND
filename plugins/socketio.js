"use strict";

const fp = require("fastify-plugin");
const getSocketConnection = require("../common/socket-service");

module.exports = fp(async (fastify) => {
  const io = getSocketConnection(fastify);
  fastify.decorate("io", io);
});
