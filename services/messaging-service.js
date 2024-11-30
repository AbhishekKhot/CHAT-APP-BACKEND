"use strict";
const redis = require("../common/redis")();

class MessagingService {
  async handleOneOnOneMessage(message) {
    const { content, sender, receiver } = message;
    const { senderId, receiverId } = this.#getSenderAndReceiverId(
      sender.phone_number,
      receiver.phone_number
    );

    const userStatus = await redis.get(
      `${receiver.country_code}${receiver.phone_number}`
    );

    const { connected } = JSON.parse(userStatus);

    await db.Chat.create({
      from_user_id: senderId,
      to_user_id: receiverId,
      message: content,
      status: connected ? "delivered" : "sent",
    });
  }

  async #getSenderAndReceiverId(senderPhoneNumber, receiverPhoneNumber) {
    const users = await db.User.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { phone_number: senderPhoneNumber },
          { phone_number: receiverPhoneNumber },
        ],
      },
      attributes: ["id", "phone_number"],
    });
    const senderUser = users.find(
      (user) => user.phone_number === sender.phone_number
    );
    const receiverUser = users.find(
      (user) => user.phone_number === receiver.phone_number
    );

    return { senderId: senderUser.id, receiverId: receiverUser.id };
  }
}

module.exports = new MessagingService();
