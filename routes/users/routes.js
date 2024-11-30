"use strict";

const {
  singupHandler,
  signinHandler,
  verifyOtpHandler,
  getUsersHandler,
} = require("../../handler/user");
const { addSchema } = require("../../common/helper-functions");

module.exports = async function userRoutes(fastify) {
  const API_PREFIX = "/chat-app";

  await addSchema(fastify, __dirname);

  fastify.route({
    method: "POST",
    url: API_PREFIX + "/signup",
    handler: singupHandler,
    schema: {
      body: {
        $ref: "schema:signup:body",
      },
    },
  });

  fastify.route({
    method: "POST",
    url: API_PREFIX + "/signin",
    handler: signinHandler,
    schema: {
      body: {
        $ref: "schema:signin:body",
      },
    },
  });

  fastify.route({
    method: "POST",
    url: API_PREFIX + "/verify-otp",
    handler: verifyOtpHandler,
    schema: {
      body: {
        $ref: "schema:verify-otp:body",
      },
    },
  });

  fastify.route({
    method: "GET",
    url: API_PREFIX + "/users",
    handler: getUsersHandler,
    schema: {
      queryString: fastify.getSchema("schema:users:query"),
    },
  });
};
