"use strict";

const fp = require("fastify-plugin");
const Redis = require("ioredis");
const fastifyRedis = require("@fastify/redis");

module.exports = fp(async function redisPlugin(fastify) {
  const client = new Redis(process.env.REDIS_URL);
  fastify.register(fastifyRedis, { client });
});
