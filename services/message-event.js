const redis = require("../common/redis")();
const messagingService = require("./messaging-service");

class MessageEvent {
  static async onConnection(params) {
    const { phoneNumber, countryCode } = params;
    await redis.set(
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

  static async onDisconnect(params) {
    const { phoneNumber, countryCode } = params;
    await redis.set(
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

  static async oneOnOneMessage(params) {
    await messagingService.handleOneOnOneMessage(params);
  }
}

module.exports = MessageEvent;
