"use strict";

const { Server } = require("socket.io");
const userService = require("../services/user");
const CustomError = require("../utils/custom-error");
const MessageEvent = require("../services/message-event");

class SocketService {
  constructor(fastify) {
    return this.#init(fastify);
  }

  #init(fastify) {
    const io = new Server(fastify.server, {
      path: "chatsocket",
      cors: {
        origin: process.env.SOCKET_CLIENT_URL,
        method: ["GET"],
      },
    });
    this.#setupMiddleware(io);
    const messageEvent = new MessageEvent(io);
    messageEvent.setup();
    return io;
  }

  #setupMiddleware(io) {
    io.use(async (socket, next) => {
      const { phoneNumber, countryCode } = socket.handshake.query;

      if (!phoneNumber || !countryCode) {
        return next(
          CustomError.notFoundError("Phone Number & Country Code required")
        );
      }

      const user = await userService.getUserByPhoneNumber(
        phoneNumber.trim(),
        countryCode.trim()
      );

      if (!user) {
        return next(
          CustomError.unauthorizedError(
            "Authentication error: User not found with given phone number"
          )
        );
      }

      socket.user = user;
      next();
    });
  }
}

module.exports = (fastify) => {
  let instance = null;
  return () => {
    if (!instance) {
      instance = new SocketService(fastify);
    }
    return instance;
  };
};
