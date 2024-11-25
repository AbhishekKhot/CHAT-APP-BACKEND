const redis = require("../common/redis")();
const messagingService = require("./messaging-service");

class MessageEvent {
  constructor(io) {
    this.io = io;
    this.redis = redis;
  }
  setup() {
    this.io.on("connection", this.#handleConnection.bind(this));
    this.io.on("disconnect", this.#handleDisconnect.bind(this));
    this.io.on("new_message", this.#handleOneOnOneMessage.bind(this));
    console.log("SETUP DONE");
  }

  async #handleConnection(socket) {
    const { phoneNumber, countryCode } = socket.handshake.query;
    await this.redis.set(
      `${countryCode}${phoneNumber}`,
      JSON.stringify({
        connected: true,
        last_active_at: new Date().toISOString(),
      })
    );
    console.log(
      `New Client Connected With PhoneNumber: ${countryCode}${phoneNumber}`
    );
  }

  async #handleDisconnect(socket) {
    const { phoneNumber, countryCode } = socket.handshake.query;
    await this.redis.set(
      `${countryCode}${phoneNumber}`,
      JSON.stringify({
        connected: false,
        last_active_at: new Date().toISOString(),
      })
    );
    console.log(
      `Client Disconnected With PhoneNumber: ${countryCode}${phoneNumber}`
    );
  }

  async #handleOneOnOneMessage(message) {
    this.io.to(receiver.phone_number).emit("NEW_MESSAGE", message);
    await messagingService.handleOne2OneMessage(message);
  }
}

module.exports = MessageEvent;
