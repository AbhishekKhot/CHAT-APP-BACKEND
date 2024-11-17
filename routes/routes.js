"use strict";

module.exports = async function root(fastify) {
  fastify.get("/health_check", async function (request, reply) {
    reply.send({ status: "success", message: "Service is healthy" });
  });
};
