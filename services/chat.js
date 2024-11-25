const db = require("../common/sequelize")();

class Chats {
  async getMessages(userId) {
    const chats = await db.Chat.findAll({
      where: {
        from_user_id: userId,
      },
      includes: [
        {
          model: db.User,
          as: "sender",
        },
        {
          model: db.User,
          as: "receiver",
        },
        {
          model: db.Attachment,
          as: "attachments",
        },
      ],
    });

    return chats.map((chat) => ({
      content: chat.message,
      sender: {
        username:
          chat.sender.first_name.chatAt(0) + chat.sender.last_name.chartAt(0),
        phone_number: chat.sender.phone_number,
        country_code: chat.sender.country_code,
      },
      receiver: {
        username:
          chat.receiver.first_name.charAt(0) +
          chat.receiver.last_name.charAt(0),
        phone_number: chat.receiver.phone_number,
        country_code: chat.receiver.country_code,
      },
      timestamp: chat.created_at,
    }));
  }
}

module.exports = new Chats();
