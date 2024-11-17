"use strict";

const fp = require("fastify-plugin");
const { Server } = require("socket.io");
const userService = require("../services/user");
const customError = require("../utils/custom-error");

module.exports = fp(async (fastify) => {
  const server = fastify.server;

  const io = new Server(server, {
    path: "/chat_sockets",
    cors: {
      origin: process.env.SOCKET_CLIENT_URL,
      method: ["GET"],
    },
  });

  const authenticateSocket = async (socketioServer, next) => {
    const phoneNumber = socketioServer.handshake.query.phoneNumber;
    if (!phoneNumber) {
      return next(customError.unauthorizedError("Phone number is required"));
    }
    const user = await userService.getUserByPhoneNumber(phoneNumber.trim());
    if (!user) {
      return next(
        customError.unauthorizedError("Authentication error: User not found")
      );
    }
    socket.user = user;
    next();
  };

  io.use(authenticateSocket);

  fastify.decorate("io", io);
});
