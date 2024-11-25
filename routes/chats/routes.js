"use strict";

const { getChatsHandler } = require("../../handler/chat");
const { addSchema } = require("../../common/helper-functions");

module.exports = async function userRoutes(fastify) {
  const API_PREFIX = "/chat-app";

  await addSchema(fastify, __dirname);

  fastify.route({
    method: "GET",
    url: API_PREFIX + "/messages",
    handler: getChatsHandler,
    schema: {
      queryString: fastify.getSchema("schema:chats:query"),
    },
  });
};
