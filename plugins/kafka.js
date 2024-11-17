"use strict";

const fp = require("fastify-plugin");
const initKafka = require("../common/kafka");

module.exports = fp(async (fastify) => {
  const kafka = await initKafka();
  fastify.decorate("kafka", kafka);
});
