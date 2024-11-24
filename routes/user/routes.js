"use strict";

const {
  singupHandler,
  signinHandler,
  verifyOtpHandler,
} = require("../../handler/signup-handler");
const { addSchema } = require("../../common/helper-functions");

module.exports = async function userRoutes(fastify) {
  const API_PREFIX = "/chat_app";

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
    url: API_PREFIX + "/verify_otp",
    handler: verifyOtpHandler,
    schema: {
      body: {
        $ref: "schema:verify-otp:body",
      },
    },
  });
};
