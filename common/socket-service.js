"use strict";

const { Server } = require("socket.io");
const userService = require("../services/user");
const CustomError = require("../utils/custom-error");
const MessageEvent = require("../services/message-event");

let IO = null;
class SocketService {
  constructor(server) {
    this.server = server;
  }

  init() {
    const io = new Server(this.server, {
      path: "chat-sockets",
      transports: ["websocket"],
      cors: {
        origin: process.env.ALLOWED_ORIGINS.split(",") || "*",
        method: ["GET"],
      },
    });
    this.#setupMiddleware(io);
    this.#setupEventHandlers(io);
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

  #setupEventHandlers(io) {
    console.log("CALLED");
    io.on("connect", (socket) => {
      console.log("CONNECTION CALLED:", socket.handshake.query);
      MessageEvent.onConnection(socket.handshake.query);

      // Handle one-on-one message event on the individual socket
      socket.on("one_on_one_message", (message) => {
        io.to(message.receiver.phone_number).emit("new_message", message);
        MessageEvent.oneOnOneMessage(message);
      });
    });
    io.on("disconnect", (socket) => {
      console.log("DISCONNECT CALLED:", socket.handshake.query);
      MessageEvent.onDisconnect(socket.handshake.query);
    });
  }
}

function getSocketIO(server) {
  if (IO) return IO;
  const socketService = new SocketService(server);
  IO = socketService.init();
  IO.on("connect", (socket) => {
    console.log("Connected");
  });
  return IO;
}

module.exports = getSocketIO;
