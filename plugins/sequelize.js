"use strict";

const fp = require("fastify-plugin");
const getDatabaseConnection = require("../common/sequelize");

module.exports = fp(async (fastify) => {
  const db = getDatabaseConnection();
  fastify.decorate("sequelize", db);

  fastify.addHook("onClose", async () => {
    await db.sequelize.close();
  });
});
