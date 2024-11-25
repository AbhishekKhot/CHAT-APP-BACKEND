"use strict";

const fp = require("fastify-plugin");
const fastifyRedis = require("@fastify/redis");
const getRedisClient = require("../common/redis");

module.exports = fp(async function redisPlugin(fastify) {
  const redisClient = getRedisClient();
  fastify.register(fastifyRedis, { client: redisClient });
});
